'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Home } from '@/lib/tibber';

interface HomeSelectorProps {
    homes: Home[];
    currentHomeId: string;
}

export default function HomeSelector({ homes, currentHomeId }: HomeSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const homeId = e.target.value;
        const params = new URLSearchParams(searchParams);
        params.set('homeId', homeId);
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="relative">
            <select
                value={currentHomeId}
                onChange={handleChange}
                className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
                {homes.map((home) => (
                    <option key={home.id} value={home.id} className="text-black">
                        {home.appNickname || home.address.address1}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
}
