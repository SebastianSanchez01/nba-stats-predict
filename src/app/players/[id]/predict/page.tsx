import React from 'react'
import Header from "../../../components/Header";
import StatPredictionForm from "../../../components/StatPredictionForm";

export default async function StatPredictionPage({ params }: { params: { id: string } }) {
    // Fetch player data through API route
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/player/${params.id}`);
    console.log(params.id)
    
    if (!res.ok) {
        console.log('i got here');
        return <p>Player not found</p>;
    }
    
    const player = await res.json();

    return (
        <main className="container">
            <Header />
            <h1 className="text-4xl font-bold mb-4 text-center mt-20">
                Predict Stats for {player.firstname} {player.lastname}
            </h1>
            <StatPredictionForm playerID={Number(params.id)} />
        </main>
    );
}