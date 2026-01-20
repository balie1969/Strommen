'use client';

import dynamic from 'next/dynamic';
import { PriceInfo, ConsumptionData } from '@/lib/tibber';

// Dynamic imports with SSR disabled to prevent hydration errors in Docker
const ElectricityPriceChart = dynamic(
    () => import('./ElectricityPriceChart').then((mod) => mod.ElectricityPriceChart),
    { ssr: false }
);
const ConsumptionChart = dynamic(() => import('./ConsumptionChart'), { ssr: false });
const HistoricalPriceChart = dynamic(() => import('./HistoricalPriceChart'), { ssr: false });
const MonthlySavingsChart = dynamic(() => import('./MonthlySavingsChart'), { ssr: false });

interface DashboardChartsProps {
    todayPrices: PriceInfo[];
    tomorrowPrices: PriceInfo[];
    consumption: ConsumptionData[];
    historicalPrices: {
        date: string;
        price: number;
    }[];
    monthlySavings: {
        month: string;
        amount: number;
    }[];
}

export default function DashboardCharts({
    todayPrices,
    tomorrowPrices,
    consumption,
    historicalPrices,
    monthlySavings,
}: DashboardChartsProps) {
    return (
        <div className="lg:col-span-2 space-y-8">
            <ElectricityPriceChart
                todayPrices={todayPrices}
                tomorrowPrices={tomorrowPrices}
            />
            <ConsumptionChart data={consumption} />
            <HistoricalPriceChart data={historicalPrices} />
            <MonthlySavingsChart data={monthlySavings} />
        </div>
    );
}
