'use client';
import { useState } from 'react';

interface CostOverviewProps {
    cost: {
        today: number;
        thisMonth: number;
        forecast: number;
    };
    consumption: {
        today: number;
        thisMonth: number;
        forecast: number;
    };
}

export default function CostOverview({ cost, consumption }: CostOverviewProps) {
    const [mode, setMode] = useState<'cost' | 'consumption'>('cost');

    const data = mode === 'cost' ? cost : consumption;
    const unit = mode === 'cost' ? 'kr' : 'kWh';
    const labelPrefix = mode === 'cost' ? 'Kostnad' : 'Forbruk';

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20 inline-flex">
                    <button
                        onClick={() => setMode('cost')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${mode === 'cost'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Kostnad
                    </button>
                    <button
                        onClick={() => setMode('consumption')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${mode === 'consumption'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Forbruk
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div className="text-sm text-gray-300 mb-1">{labelPrefix} i dag</div>
                    <div className="text-2xl font-bold text-white">
                        {Math.round(data.today).toLocaleString('nb-NO')} {unit}
                    </div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div className="text-sm text-gray-300 mb-1">Hittil i måneden</div>
                    <div className="text-2xl font-bold text-white">
                        {Math.round(data.thisMonth).toLocaleString('nb-NO')} {unit}
                    </div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div className="text-sm text-gray-300 mb-1">Prognose måned</div>
                    <div className="text-2xl font-bold text-blue-300">
                        {Math.round(data.forecast).toLocaleString('nb-NO')} {unit}
                    </div>
                </div>
            </div>
        </div>
    );
}
