import { headers } from 'next/headers';

export interface WeatherData {
    location: string;
    current: {
        temp: number;
        minTemp: number;
        maxTemp: number;
        symbol: string;
    };
    forecast: {
        date: string; // "Man", "Tir", etc.
        temp: number;
        minTemp: number;
        maxTemp: number;
        symbol: string;
    }[];
}

const MET_API_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';

// Coordinates
const LOCATIONS = {
    vinneslia: { lat: 59.76140878082162, lon: 10.101495914357141, name: 'Vinneslia, Drammen' },
    nome: { lat: 59.30525238725224, lon: 9.138461785099198, name: 'Barlaugkleiva, Nome' },
};

async function fetchMetData(lat: number, lon: number) {
    const res = await fetch(`${MET_API_URL}?lat=${lat}&lon=${lon}`, {
        headers: {
            'User-Agent': 'ElectricityTracker/1.0 github.com/balie1969/Strommen',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch weather data: ${res.statusText}`);
    }

    return res.json();
}

function getSymbolCode(timeseries: any) {
    return timeseries.data.next_1_hours?.summary?.symbol_code ||
        timeseries.data.next_6_hours?.summary?.symbol_code ||
        timeseries.data.next_12_hours?.summary?.symbol_code || 'cloudy';
}

export async function getWeatherData(locationKey: 'vinneslia' | 'nome'): Promise<WeatherData | null> {
    try {
        const loc = LOCATIONS[locationKey];
        const data = await fetchMetData(loc.lat, loc.lon);

        const timeseries = data.properties.timeseries;
        const current = timeseries[0];
        const todayDate = new Date().getDate();

        // Helper to get min/max for a specific date
        const getMinMaxForDate = (date: number) => {
            const dayEntries = timeseries.filter((t: any) => new Date(t.time).getDate() === date);
            if (dayEntries.length === 0) return { min: 0, max: 0 };

            const temps = dayEntries.map((t: any) => t.data.instant.details.air_temperature);
            return {
                min: Math.round(Math.min(...temps)),
                max: Math.round(Math.max(...temps))
            };
        };

        const todayMinMax = getMinMaxForDate(todayDate);

        // Get forecast for next 3 days (approx noon)
        const today = new Date();
        const forecast = [];

        for (let i = 1; i <= 3; i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);
            targetDate.setHours(12, 0, 0, 0); // Target noon

            // Find closest timeseries entry for symbol/noon temp
            const entry = timeseries.find((t: any) => {
                const tDate = new Date(t.time);
                return tDate.getDate() === targetDate.getDate() && Math.abs(tDate.getHours() - 12) < 2;
            });

            const dayMinMax = getMinMaxForDate(targetDate.getDate());

            if (entry) {
                forecast.push({
                    date: targetDate.toLocaleDateString('no-NO', { weekday: 'short' }).replace('.', ''),
                    temp: Math.round(entry.data.instant.details.air_temperature),
                    minTemp: dayMinMax.min,
                    maxTemp: dayMinMax.max,
                    symbol: getSymbolCode(entry),
                });
            }
        }

        return {
            location: loc.name,
            current: {
                temp: Math.round(current.data.instant.details.air_temperature),
                minTemp: todayMinMax.min,
                maxTemp: todayMinMax.max,
                symbol: getSymbolCode(current),
            },
            forecast,
        };
    } catch (error) {
        console.error(`Error fetching weather for ${locationKey}:`, error);
        return null;
    }
}
