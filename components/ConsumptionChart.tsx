'use client';

import { ConsumptionData } from '@/lib/tibber';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ConsumptionChartProps {
    data: ConsumptionData[];
}

export default function ConsumptionChart({ data }: ConsumptionChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 h-[300px] flex items-center justify-center">
                <p className="text-gray-400">Ingen forbruksdata tilgjengelig</p>
            </div>
        );
    }

    const NORGESPRIS_BASELINE = 0.50;

    const formattedData = data.map((item) => ({
        ...item,
        time: new Date(item.from).getHours().toString().padStart(2, '0') + ':00',
        cost: item.consumption * NORGESPRIS_BASELINE,
    }));

    const consumptions = formattedData.map(d => d.consumption);
    const maxConsumption = Math.max(...consumptions);
    const minConsumption = Math.min(...consumptions);
    const avgConsumption = consumptions.reduce((a, b) => a + b, 0) / consumptions.length;

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-center">
                    <div className="text-xs text-gray-300 mb-1">Snitt</div>
                    <div className="text-lg font-bold text-white">{avgConsumption.toFixed(2)} kWh</div>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-center">
                    <div className="text-xs text-gray-300 mb-1">Laveste</div>
                    <div className="text-lg font-bold text-green-300">{minConsumption.toFixed(2)} kWh</div>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-center">
                    <div className="text-xs text-gray-300 mb-1">Høyeste</div>
                    <div className="text-lg font-bold text-red-300">{maxConsumption.toFixed(2)} kWh</div>
                </div>
            </div>

            {/* Chart */}
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <h3 className="text-lg font-medium text-white mb-4">Forbruk og Kostnad (Siste 24 timer)</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                                yAxisId="left"
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                                label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#fb923c"
                                tick={{ fill: '#fb923c', fontSize: 12 }}
                                label={{ value: 'NOK', angle: 90, position: 'insideRight', fill: '#fb923c' }}
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
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                formatter={(value: number, name: string) => [
                                    name === 'consumption' ? `${value.toFixed(2)} kWh` : `${value.toFixed(2)} kr`,
                                    name === 'consumption' ? 'Forbruk' : 'Kostnad (Norgespris)'
                                ]}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="consumption"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                dot={{ fill: '#60a5fa', r: 3 }}
                                activeDot={{ r: 5 }}
                                name="consumption"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="cost"
                                stroke="#fb923c"
                                strokeWidth={2}
                                dot={{ fill: '#fb923c', r: 3 }}
                                activeDot={{ r: 5 }}
                                name="cost"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
