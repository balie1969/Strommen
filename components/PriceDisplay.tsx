import { PriceInfo } from '@/lib/tibber';

interface PriceDisplayProps {
    price: PriceInfo | null;
}

export default function PriceDisplay({ price }: PriceDisplayProps) {
    if (!price) {
        return (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-medium text-zinc-500 dark:text-zinc-400">Current Price</h2>
                <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-100">--</p>
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat('no-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: 2,
    }).format(price.total);

    return (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-medium text-zinc-500 dark:text-zinc-400">Current Price</h2>
            <p className="text-4xl font-bold mt-2 text-zinc-900 dark:text-zinc-100">{formattedPrice}</p>
            <p className="text-sm text-zinc-500 mt-1">
                Energy: {price.energy.toFixed(2)} | Tax: {price.tax.toFixed(2)}
            </p>
        </div>
    );
}
