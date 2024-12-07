/* eslint-disable react/react-in-jsx-scope */
"use client";

import Link from "next/link";
import { FaBasketballBall, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) return;

        try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(trimmedQuery)}`);
            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();

            if (data.length === 1) {
                const result = data[0];
                if (result.type === 'player') {
                    router.push(`/players/${result.id}`);
                } else if (result.type === 'team') {
                    router.push(`/teams/${result.id}`);
                }
            } else {
                router.push('/not-found');
            }
        } catch (error) {
            console.error("Search error:", error);
            router.push('/not-found');
        }
    };

    return (
        <header className="flex flex-col items-center p-3 space-y-4">
            <Link href={"/"} className="font-bold text-xl flex gap-0.5 items-center text-orange-600">
                <span className="text-blue-600">NBA</span>
                <span className="text-red-600">Wise</span>
                <FaBasketballBall size={20} />
            </Link>
            <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Search players and teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-full px-6 py-2.5 w-80 
                             border border-gray-300 
                             shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200
                             text-gray-700 placeholder-gray-400
                             bg-white/90 backdrop-blur-sm"
                />
                <button
                    type="submit"
                    className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    <FaSearch size={16} />
                </button>
            </form>
        </header>
    );
}



