/* eslint-disable react/react-in-jsx-scope */
"use client";

import Link from "next/link";
import { FaBasketballBall } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiBetfair } from "react-icons/si";

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
        <header className="flex items-center p-3">
            <div className="flex items-center gap-8">
                <Link href={"/"} className="font-bold text-xl flex gap-0.5 items-center text-orange-600">
                    <FaBasketballBall size={20} />
                    <span className="text-blue-600">NBA</span>
                    <span className="text-red-600">Wise</span>
                </Link>
                <nav className="flex gap-4">
                    <Link href={"/"} className="font-bold flex items-center">
                        <span className="">Projections</span>
                        <SiBetfair size={20} />
                    </Link>
                </nav>
            </div>
            <div className="flex-grow flex justify-center">
                <form onSubmit={handleSearch} className="flex">
                    <input
                        type="text"
                        placeholder="Search players and teams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-full text-center border border-black p-2 w-72 mr-12"
                    />
                    <button type="submit" className="hidden">Search</button>
                </form>
            </div>
            <nav className="flex gap-6 items-center">
                <Link href={"/"}>Sign in</Link>
                <Link href={"/"} className="rounded-full bg-blue-600 text-white py-2 px-4">Get Started</Link>
            </nav>
        </header>
    );
}



