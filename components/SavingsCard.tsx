interface SavingsCardProps {
    title: string;
    amount: number;
    description: string;
    highlight?: boolean;
}

export default function SavingsCard({ title, amount, description, highlight }: SavingsCardProps) {
    const formattedAmount = new Intl.NumberFormat('no-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

    return (
        <div className={`p-6 backdrop-blur-md rounded-xl border flex flex-col items-center justify-center text-center ${highlight
                ? 'bg-blue-500/20 border-blue-400/50'
                : 'bg-white/10 border-white/20'
            }`}>
            <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
            <p className={`text-3xl font-bold ${highlight ? 'text-blue-300' : 'text-green-400'}`}>{formattedAmount}</p>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
    );
}
