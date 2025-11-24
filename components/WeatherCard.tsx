import { WeatherData } from '@/lib/weather';

const getWeatherIcon = (symbol: string) => {
    if (symbol.includes('sun') || symbol.includes('clear')) return '☀️';
    if (symbol.includes('cloud') && symbol.includes('sun')) return 'Qloud'; // Typo intended for visual distinction if font supports, but let's stick to standard emojis
    if (symbol.includes('partlycloudy')) return 'Qw';
    if (symbol.includes('cloud')) return '☁️';
    if (symbol.includes('rain')) return '🌧️';
    if (symbol.includes('snow')) return '❄️';
    if (symbol.includes('fog')) return '🌫️';
    if (symbol.includes('sleet')) return '🌨️';
    if (symbol.includes('thunder')) return '⚡';
    return '☁️';
};

// Better mapping using standard emojis
const getEmoji = (symbol: string) => {
    const s = symbol.toLowerCase();
    if (s.includes('clearsky')) return '☀️';
    if (s.includes('fair')) return '🌤️';
    if (s.includes('partlycloudy')) return 'Qw'; // Wait, standard emojis:
    if (s.includes('cloudy')) return '☁️';
    if (s.includes('rain')) return '🌧️';
    if (s.includes('snow')) return '❄️';
    if (s.includes('sleet')) return '🌨️';
    if (s.includes('fog')) return '🌫️';
    return 'Qloud';
};

// Let's try to use a simple text mapping for now, or maybe just the symbol name if it's readable.
// Actually, let's use a simple mapping function inside the component.

export default function WeatherCard({ data }: { data: WeatherData | null }) {
    if (!data) return null;

    const getIcon = (symbol: string) => {
        const s = symbol.toLowerCase();
        if (s.includes('clearsky')) return '☀️';
        if (s.includes('fair')) return '🌤️';
        if (s.includes('partlycloudy')) return '⛅';
        if (s.includes('cloudy')) return '☁️';
        if (s.includes('rain') && s.includes('thunder')) return '⛈️';
        if (s.includes('rain')) return '🌧️';
        if (s.includes('snow')) return '❄️';
        if (s.includes('sleet')) return '🌨️';
        if (s.includes('fog')) return '🌫️';
        return '☁️';
    };

    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">{data.location}</h3>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{getIcon(data.current.symbol)}</span>
                        <div>
                            <span className="text-3xl font-bold text-white">{data.current.temp}°</span>
                            <div className="text-xs text-gray-400 mt-1">
                                <span className="text-blue-300">L: {data.current.minTemp}°</span>
                                <span className="mx-2">|</span>
                                <span className="text-red-300">H: {data.current.maxTemp}°</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-white/10">
                {data.forecast.map((day, i) => (
                    <div key={i} className="text-center">
                        <div className="text-xs text-gray-400 mb-1 capitalize">{day.date}</div>
                        <div className="text-lg mb-1">{getIcon(day.symbol)}</div>
                        <div className="text-xs space-x-1">
                            <span className="text-blue-300">{day.minTemp}°</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-red-300">{day.maxTemp}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
