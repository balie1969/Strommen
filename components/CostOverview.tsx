'use client';

interface CostOverviewProps {
    cost: {
        today: number;
        thisMonth: number;
        forecast: number;
    };
}

export default function CostOverview({ cost }: CostOverviewProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="text-sm text-gray-300 mb-1">Kostnad i dag</div>
                <div className="text-2xl font-bold text-white">
                    {Math.round(cost.today).toLocaleString('nb-NO')} kr
                </div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="text-sm text-gray-300 mb-1">Hittil i måneden</div>
                <div className="text-2xl font-bold text-white">
                    {Math.round(cost.thisMonth).toLocaleString('nb-NO')} kr
                </div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="text-sm text-gray-300 mb-1">Prognose måned</div>
                <div className="text-2xl font-bold text-blue-300">
                    {Math.round(cost.forecast).toLocaleString('nb-NO')} kr
                </div>
            </div>
        </div>
    );
}
