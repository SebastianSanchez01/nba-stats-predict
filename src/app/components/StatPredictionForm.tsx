// components/StatPredictionForm.tsx
'use client';

import React, { useState } from "react";

export default function StatPredictionForm({ playerID }: { playerID: number }) {
    const [statistic, setStatistic] = useState("points");
    const [opposingTeamID, setOpposingTeamID] = useState("");
    const [spread, setSpread] = useState("");
    const [choice, setChoice] = useState<"over" | "under" | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!spread || !choice) {
            alert("Please select a statistic, set a spread, and choose Over or Under.");
            return;
        }
        
        try {
            // Example of sending prediction to an API route
            const response = await fetch('/api/predictions/player', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerID,
                    statistic,
                    spread: Number(spread),
                    opposingTeamID: Number(opposingTeamID),
                    choice
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                return;
            }

            const result = await response.json();

            
            alert(
                `Prediction Results:\n` +
                `Statistic: ${statistic}\n` +
                `Choice: ${choice}\n` +
                `Spread: ${spread}\n` +
                `Probability: ${(result.probability * 100).toFixed(2)}%`
            );
            // Handle prediction result
            console.log(result);
        } catch (error) {
            console.error('Prediction submission error:', error);
        }
    };

    return (
        <form className="mt-8" onSubmit={handleSubmit}>
            {/* Select Opposing Team */}
            <label className="block mb-4">
                <span className="text-gray-700">Opposing Team</span>
                <select
                    value={opposingTeamID}
                    onChange={(e) => setOpposingTeamID(e.target.value)}
                    className="block w-full mt-1 border rounded-md shadow-sm"
                >
                    <option value="1">Atlanta Hawks</option>
                    <option value="2">Boston Celtics</option>
                    <option value="4">Brooklyn Nets</option>
                    <option value="5">Charlotte Hornets</option>
                    <option value="6">Chicago Bulls</option>
                    <option value="7">Cleveland Cavaliers</option>
                    <option value="8">Dallas Mavericks</option>
                    <option value="9">Denver Nuggets</option>
                    <option value="10">Detroit Pistons</option>
                    <option value="11">Golden State Warriors</option>
                    <option value="14">Houston Rockets</option>
                    <option value="15">Indiana Pacers</option>
                    <option value="16">LA Clippers</option>
                    <option value="17">Los Angeles Lakers</option>
                    <option value="19">Memphis Grizzlies</option>
                    <option value="20">Miami Heat</option>
                    <option value="21">Milwaukee Bucks</option>
                    <option value="22">Minnesota Timberwolves</option>
                    <option value="23">New Orleans Pelicans</option>
                    <option value="24">New York Knicks</option>
                    <option value="25">Oklahoma City Thunder</option>
                    <option value="26">Orlando Magic</option>
                    <option value="27">Philadelphia 76ers</option>
                    <option value="28">Phoenix Suns</option>
                    <option value="29">Portland Trail Blazers</option>
                    <option value="30">Sacramento Kings</option>
                    <option value="31">San Antonio Spurs</option>
                    <option value="38">Toronto Raptors</option>
                    <option value="40">Utah Jazz</option>
                    <option value="41">Washington Wizards</option>
                </select>
            </label>

               {/* Select Statistic */}
            <label className="block mb-4">
                <span className="text-gray-700">Statistic</span>
                <select
                    value={statistic}
                    onChange={(e) => setStatistic(e.target.value)}
                    className="block w-full mt-1 border rounded-md shadow-sm"
                >
                    <option value="points">Points</option>
                    <option value="assists">Assists</option>
                    <option value="totReb">Rebounds</option>
                    <option value="steals">Steals</option>
                    <option value="blocks">Blocks</option>
                    <option value="turnovers">Turnovers</option>
                </select>
            </label>

            {/* Input Spread */}
            <label className="block mb-4">
                <span className="text-gray-700">Spread</span>
                <input
                    type="number"
                    step="0.1"
                    value={spread}
                    onChange={(e) => setSpread(e.target.value)}
                    placeholder="Enter a float value"
                    className="block w-full mt-1 border rounded-md shadow-sm"
                />
            </label>

            {/* Over/Under Buttons */}
            <div className="flex justify-around mt-4">
                <button
                    type="button"
                    onClick={() => setChoice("over")}
                    className={`px-6 py-2 font-semibold rounded-md ${
                        choice === "over" ? "bg-green-500 text-white" : "bg-gray-200"
                    }`}
                >
                    Over
                </button>
                <button
                    type="button"
                    onClick={() => setChoice("under")}
                    className={`px-6 py-2 font-semibold rounded-md ${
                        choice === "under" ? "bg-red-500 text-white" : "bg-gray-200"
                    }`}
                >
                    Under
                </button>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="mt-8 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 w-full"
            >
                Submit Prediction
            </button>
        </form>
        
    );
}