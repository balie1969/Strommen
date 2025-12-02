'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

interface HistoricalPriceChartProps {
    data: {
        date: string;
        price: number;
    }[];
}

const SUBSIDY_THRESHOLD = 0.9375;
const NORGESPRIS_BASELINE = 0.50;

export default function HistoricalPriceChart({ data }: HistoricalPriceChartProps) {
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    return (
        <div className="w-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-medium text-white">Spotpris historikk</h2>
                    <p className="text-sm text-gray-400">Forrige og nåværende måned</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Snitt</p>
                        <p className="text-sm font-medium text-white">{avgPrice.toFixed(2)} kr</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Laveste</p>
                        <p className="text-sm font-medium text-green-400">{minPrice.toFixed(2)} kr</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Høyeste</p>
                        <p className="text-sm font-medium text-red-400">{maxPrice.toFixed(2)} kr</p>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                            interval={4}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                            label={{
                                value: 'kr/kWh',
                                angle: -90,
                                position: 'insideLeft',
                                fill: 'rgba(255,255,255,0.7)',
                            }}
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
                            formatter={(value: number) => [`${value.toFixed(2)} kr/kWh`, 'Spotpris']}
                        />
                        <ReferenceLine
                            y={SUBSIDY_THRESHOLD}
                            stroke="#fb923c"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            label={{
                                value: `Strømstøtte innslag (${SUBSIDY_THRESHOLD.toFixed(2)} kr)`,
                                fill: '#fb923c',
                                fontSize: 12,
                                position: 'insideTopRight',
                            }}
                        />
                        <ReferenceLine
                            y={NORGESPRIS_BASELINE}
                            stroke="#4ade80"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            label={{
                                value: `Norgespris (${NORGESPRIS_BASELINE.toFixed(2)} kr)`,
                                fill: '#4ade80',
                                fontSize: 12,
                                position: 'insideBottomRight',
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
    );
}
