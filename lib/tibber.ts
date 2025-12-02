import { GraphQLClient, gql } from 'graphql-request';

const TIBBER_API_ENDPOINT = 'https://api.tibber.com/v1-beta/gql';

export interface PriceInfo {
  total: number;
  energy: number;
  tax: number;
  startsAt: string;
}

export interface ConsumptionData {
  from: string;
  to: string;
  cost: number;
  unitPrice: number;
  unitPriceVAT: number;
  consumption: number;
  consumptionUnit: string;
}

export interface Home {
  id: string;
  appNickname: string | null;
  address: {
    address1: string;
  };
}

export interface SavingsData {
  today: number;
  thisMonth: number;
  lastMonth: number;
  sinceOctober: number;
}

export interface TibberData {
  homes: Home[];
  currentHome: Home | null;
  currentPrice: PriceInfo | null;
  todayPrices: PriceInfo[];
  tomorrowPrices: PriceInfo[];
  consumption: ConsumptionData[];
  historicalPrices: { date: string; price: number }[];
  monthlySavings: { month: string; amount: number }[];
  savings: SavingsData;
  cost: {
    today: number;
    thisMonth: number;
    forecast: number;
  };
  consumptionOverview: {
    today: number;
    thisMonth: number;
    forecast: number;
  };
}

const NORGESPRIS_BASELINE = 0.50; // NOK/kWh including VAT

export const getTibberData = async (homeId?: string): Promise<TibberData> => {
  const token = process.env.TIBBER_API_TOKEN;

  if (!token) {
    throw new Error('TIBBER_API_TOKEN is not set');
  }

  const client = new GraphQLClient(TIBBER_API_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const query = gql`
    query TibberData($homeId: ID!) {
      viewer {
        homes {
          id
          appNickname
          address {
            address1
          }
        }
        home(id: $homeId) {
          id
          appNickname
          address {
            address1
          }
          currentSubscription {
            priceInfo {
              current {
                total
                energy
                tax
                startsAt
              }
              today {
                total
                energy
                tax
                startsAt
              }
              tomorrow {
                total
                energy
                tax
                startsAt
              }
            }
          }
          daily: consumption(resolution: DAILY, last: 100) {
            nodes {
              from
              to
              cost
              unitPrice
              unitPriceVAT
              consumption
              consumptionUnit
            }
          }
          hourly: consumption(resolution: HOURLY, last: 24) {
            nodes {
              from
              to
              cost
              unitPrice
              unitPriceVAT
              consumption
              consumptionUnit
            }
          }
        }
      }
    }
  `;

  // First fetch homes if no ID provided or to validate
  let targetHomeId = homeId;

  if (!targetHomeId) {
    const homesQuery = gql`{ viewer { homes { id } } }`;
    const homesData: any = await client.request(homesQuery);
    targetHomeId = homesData.viewer.homes[0]?.id;
  }

  if (!targetHomeId) {
    throw new Error('No homes found');
  }

  try {
    const data: any = await client.request(query, { homeId: targetHomeId });
    const viewer = data.viewer;
    const currentHome = viewer.home;

    if (!currentHome) {
      throw new Error('Home not found');
    }

    // Calculate savings
    const calculateSavings = (nodes: any[], fromDate?: Date) => {
      return nodes.reduce((acc, node) => {
        const nodeDate = new Date(node.from);
        if (fromDate && nodeDate < fromDate) return acc;

        // Savings = (SpotPrice - Norgespris) * Consumption
        // Note: unitPrice includes VAT, Norgespris includes VAT
        const savings = (node.unitPrice - NORGESPRIS_BASELINE) * node.consumption;
        return acc + savings;
      }, 0);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfOctober = new Date('2025-10-01T00:00:00');

    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // For "Today", we need hourly data for the current day
    // The hourly query returns last 24 hours, which might overlap days.
    // Filter for today's date.
    const todaySavings = calculateSavings(
      currentHome.hourly.nodes.filter((n: any) => new Date(n.from) >= today)
    );

    const thisMonthSavings = calculateSavings(currentHome.daily.nodes, startOfMonth);
    const lastMonthSavings = calculateSavings(
      currentHome.daily.nodes.filter((n: any) => {
        const d = new Date(n.from);
        return d >= startOfLastMonth && d <= endOfLastMonth;
      })
    );
    const sinceOctoberSavings = calculateSavings(currentHome.daily.nodes, startOfOctober);

    return {
      homes: viewer.homes,
      currentHome: {
        id: currentHome.id,
        appNickname: currentHome.appNickname,
        address: currentHome.address,
      },
      currentPrice: currentHome.currentSubscription?.priceInfo?.current || null,
      todayPrices: currentHome.currentSubscription?.priceInfo?.today || [],
      tomorrowPrices: currentHome.currentSubscription?.priceInfo?.tomorrow || [],
      consumption: currentHome.hourly.nodes || [],
      historicalPrices: currentHome.daily.nodes
        .filter((n: any) => {
          const d = new Date(n.from);
          return d >= startOfLastMonth;
        })
        .map((n: any) => ({
          date: new Date(n.from).toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit' }),
          price: n.unitPrice,
        })),
      monthlySavings: (() => {
        const nodesSinceOctober = currentHome.daily.nodes.filter((n: any) => new Date(n.from) >= startOfOctober);
        console.log('Nodes since October:', nodesSinceOctober.length);
        const savingsByMonth: { [key: string]: number } = {};

        nodesSinceOctober.forEach((node: any) => {
          const date = new Date(node.from);
          const monthKey = date.toLocaleDateString('no-NO', { month: 'long', year: 'numeric' });
          // Capitalize first letter
          const formattedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);

          const savings = (node.unitPrice - NORGESPRIS_BASELINE) * node.consumption;

          if (!savingsByMonth[formattedMonth]) {
            savingsByMonth[formattedMonth] = 0;
          }
          savingsByMonth[formattedMonth] += savings;
        });

        return Object.entries(savingsByMonth).map(([month, amount]) => ({
          month,
          amount,
        }));
      })(),
      savings: {
        today: todaySavings,
        thisMonth: thisMonthSavings,
        lastMonth: lastMonthSavings,
        sinceOctober: sinceOctoberSavings,
      },
      cost: {
        today: currentHome.hourly.nodes
          .filter((n: any) => new Date(n.from) >= today)
          .reduce((acc: number, node: any) => acc + node.cost, 0),
        thisMonth: currentHome.daily.nodes
          .filter((n: any) => new Date(n.from) >= startOfMonth)
          .reduce((acc: number, node: any) => acc + node.cost, 0),
        forecast: (() => {
          const monthNodes = currentHome.daily.nodes.filter((n: any) => new Date(n.from) >= startOfMonth);
          const totalCostSoFar = monthNodes.reduce((acc: number, node: any) => acc + node.cost, 0);
          const daysSoFar = monthNodes.length;
          if (daysSoFar === 0) return 0;

          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
          const avgDailyCost = totalCostSoFar / daysSoFar;
          return totalCostSoFar + (avgDailyCost * (daysInMonth - daysSoFar));
        })(),
      },
      consumptionOverview: {
        today: currentHome.hourly.nodes
          .filter((n: any) => new Date(n.from) >= today)
          .reduce((acc: number, node: any) => acc + node.consumption, 0),
        thisMonth: currentHome.daily.nodes
          .filter((n: any) => new Date(n.from) >= startOfMonth)
          .reduce((acc: number, node: any) => acc + node.consumption, 0),
        forecast: (() => {
          const monthNodes = currentHome.daily.nodes.filter((n: any) => new Date(n.from) >= startOfMonth);
          const totalConsumptionSoFar = monthNodes.reduce((acc: number, node: any) => acc + node.consumption, 0);
          const daysSoFar = monthNodes.length;
          if (daysSoFar === 0) return 0;

          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
          const avgDailyConsumption = totalConsumptionSoFar / daysSoFar;
          return totalConsumptionSoFar + (avgDailyConsumption * (daysInMonth - daysSoFar));
        })(),
      },
    };
  } catch (error) {
    console.error('Error fetching Tibber data:', error);
    throw error;
  }
};
