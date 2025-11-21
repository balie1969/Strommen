import { getTibberData } from '@/lib/tibber';
import { ElectricityPriceChart } from '@/components/ElectricityPriceChart';
import ConsumptionChart from '@/components/ConsumptionChart';
import SavingsCard from '@/components/SavingsCard';
import HomeSelector from '@/components/HomeSelector';
import CostOverview from '@/components/CostOverview';

import HistoricalPriceChart from '@/components/HistoricalPriceChart';
import MonthlySavingsChart from '@/components/MonthlySavingsChart';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ homeId?: string }>;
}) {
  const { homeId } = await searchParams;
  const data = await getTibberData(homeId);

  return (
    <main className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Strømpris
            </h1>
            <p className="text-gray-400">
              Oversikt over strømpriser og forbruk
            </p>
          </div>
          <HomeSelector homes={data.homes} currentHomeId={data.currentHome?.id || ''} />
        </header>

        {/* Cost Overview */}
        <CostOverview cost={data.cost} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Charts) */}
          <div className="lg:col-span-2 space-y-8">
            <ElectricityPriceChart
              todayPrices={data.todayPrices}
              tomorrowPrices={data.tomorrowPrices}
            />
            <ConsumptionChart data={data.consumption} />
            <HistoricalPriceChart data={data.historicalPrices} />
            <MonthlySavingsChart data={data.monthlySavings} />
          </div>

          {/* Sidebar (Savings) */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Dine besparelser</h3>
              <SavingsCard
                title="I dag"
                amount={data.savings.today}
                description="Spart sammenlignet med Norgespris"
              />
              <SavingsCard
                title="Denne måneden"
                amount={data.savings.thisMonth}
                description="Akkumulert sparing hittil i måneden"
              />
              <SavingsCard
                title="Forrige måned"
                amount={data.savings.lastMonth}
                description="Total sparing forrige måned"
              />
              <SavingsCard
                title="Siden 1. oktober"
                amount={data.savings.sinceOctober}
                description="Total sparing siden startdato"
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
