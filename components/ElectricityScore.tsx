'use client';

interface ElectricityScoreProps {
    score: number;
}

export default function ElectricityScore({ score }: ElectricityScoreProps) {
    // Determine color based on score
    let color = 'text-yellow-400';
    let label = 'Middels';

    if (score >= 75) {
        color = 'text-green-400';
        label = 'Utmerket';
    } else if (score >= 60) {
        color = 'text-green-300';
        label = 'Bra';
    } else if (score <= 40) {
        color = 'text-red-400';
        label = 'Dårlig';
    } else if (score <= 25) {
        color = 'text-red-500';
        label = 'Kritisk';
    }

    return (
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-30"></div>

            <h3 className="text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">Strømscore</h3>

            <div className="relative flex items-center justify-center w-32 h-32">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/10"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={351.86}
                        strokeDashoffset={351.86 - (351.86 * score) / 100}
                        className={color}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className={`text-3xl font-bold ${color}`}>{score}</span>
                    <span className="text-xs text-gray-400">/ 100</span>
                </div>
            </div>

            <div className={`mt-2 text-lg font-medium ${color}`}>
                {label}
            </div>
            <p className="text-xs text-gray-400 mt-1 text-center max-w-[200px]">
                Basert på hvor effektivt du bruker strømmen i forhold til spotpris.
            </p>
        </div>
    );
}
