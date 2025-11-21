'use client';

import { PriceInfo } from '@/lib/tibber';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ElectricityPriceChartProps {
    todayPrices: PriceInfo[];
    tomorrowPrices: PriceInfo[];
}

export function ElectricityPriceChart({ todayPrices, tomorrowPrices }: ElectricityPriceChartProps) {
    const currentHour = new Date().getHours();
    const NORGESPRIS_BASELINE = 0.50; // NOK/kWh including VAT

    // Combine today and tomorrow's prices
    const allPrices = [
        ...todayPrices.map((price, index) => ({
            hour: index,
            price: price.total,
            time: new Date(price.startsAt).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }),
            day: 'I dag',
            isCurrentHour: index === currentHour,
        })),
        ...(tomorrowPrices?.map((price, index) => ({
            hour: index + 24,
            price: price.total,
            time: new Date(price.startsAt).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }),
            day: 'I morgen',
            isCurrentHour: false,
        })) || []),
    ];

    if (allPrices.length === 0) {
        return (
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 h-[300px] flex items-center justify-center">
                <p className="text-gray-400">Ingen prisdata tilgjengelig</p>
            </div>
        );
    }

    const maxPrice = Math.max(...allPrices.map(p => p.price));
    const minPrice = Math.min(...allPrices.map(p => p.price));
    const avgPrice = allPrices.reduce((sum, p) => sum + p.price, 0) / allPrices.length;

    return (
        <div className="space-y-4">
            {/* Price Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-center">
                    <div className="text-xs text-gray-300 mb-1">Gjennomsnitt</div>
                    <div className="text-lg font-bold text-white">{avgPrice.toFixed(2)} kr</div>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-center">
                    <div className="text-xs text-gray-300 mb-1">Laveste</div>
                    <div className="text-lg font-bold text-green-300">{minPrice.toFixed(2)} kr</div>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-center">
                    <div className="text-xs text-gray-300 mb-1">Høyeste</div>
                    <div className="text-lg font-bold text-red-300">{maxPrice.toFixed(2)} kr</div>
                </div>
            </div>

            {/* Chart */}
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <h3 className="text-lg font-medium text-white mb-4">Strømpris (inkl. mva)</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={allPrices} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis
                                dataKey="time"
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                                interval={3}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                                label={{ value: 'kr/kWh', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: 'white',
                                }}
                                formatter={(value: number) => [`${value.toFixed(2)} kr/kWh`, 'Pris']}
                                labelFormatter={(label, payload) => {
                                    if (payload && payload[0]) {
                                        return `${payload[0].payload.day} - ${label}`;
                                    }
                                    return label;
                                }}
                            />
                            <ReferenceLine
                                x={allPrices.find(p => p.isCurrentHour)?.time}
                                stroke="rgba(255,255,255,0.5)"
                                strokeDasharray="3 3"
                                label={{ value: 'Nå', fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                            />
                            <ReferenceLine
                                y={NORGESPRIS_BASELINE}
                                stroke="#fb923c"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                label={{
                                    value: `Norgespris (${NORGESPRIS_BASELINE.toFixed(2)} kr)`,
                                    fill: '#fb923c',
                                    fontSize: 12,
                                    position: 'insideTopRight'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                dot={{ fill: '#60a5fa', r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Info Text */}
            <div className="text-xs text-gray-400 text-center">
                {tomorrowPrices.length > 0 ? 'Viser priser for i dag og i morgen.' : 'Morgendagens priser publiseres ca. kl. 13:00.'}
            </div>
        </div>
    );
}
