'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface MonthlySavingsChartProps {
    data: {
        month: string;
        amount: number;
    }[];
}

export default function MonthlySavingsChart({ data }: MonthlySavingsChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[300px] bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 flex items-center justify-center">
                <p className="text-gray-400">Ingen data tilgjengelig for månedlig besparelse</p>
            </div>
        );
    }

    const totalSavings = data.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-medium text-white">Månedlig strømstøtte</h2>
                    <p className="text-sm text-gray-400">Siden 1. oktober 2025</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Totalt</p>
                    <p className="text-sm font-medium text-green-400">
                        {new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(totalSavings)}
                    </p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                            label={{
                                value: 'NOK',
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
                            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                            formatter={(value: number) => [
                                new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(value),
                                'Besparelse',
                            ]}
                        />
                        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? '#4ade80' : '#f87171'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
