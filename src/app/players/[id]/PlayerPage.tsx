/* eslint-disable react/react-in-jsx-scope */
import Header from "../../components/Header";
import Link from "next/link";
import { getPlayerData, getPlayerStats } from "./page";

export default async function PlayerPage({ params }: { params: { id: string } }) {
    const player = await getPlayerData(params.id);
    const stats = await getPlayerStats(params.id);

    if (!player) {
        return <p>Player not found</p>;
    }

    const sortedStats = stats ? [...stats].reverse() : [];

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
                        {player.firstname} {player.lastname}
                    </h1>
                    <p className="text-center text-gray-600 mb-4">
                        College: {player.college}
                    </p>
                </div>

                {sortedStats && sortedStats.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="px-4 py-3">Points</th>
                                        <th className="px-4 py-3">Minutes</th>
                                        <th className="px-4 py-3">FGM</th>
                                        <th className="px-4 py-3">FGA</th>
                                        <th className="px-4 py-3">FG%</th>
                                        <th className="px-4 py-3">FTM</th>
                                        <th className="px-4 py-3">FTA</th>
                                        <th className="px-4 py-3">FT%</th>
                                        <th className="px-4 py-3">OReb</th>
                                        <th className="px-4 py-3">DReb</th>
                                        <th className="px-4 py-3">TReb</th>
                                        <th className="px-4 py-3">Ast</th>
                                        <th className="px-4 py-3">Stl</th>
                                        <th className="px-4 py-3">Blk</th>
                                        <th className="px-4 py-3">Fouls</th>
                                        <th className="px-4 py-3">TO</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {sortedStats.map((game, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-center font-semibold">{game.points}</td>
                                            <td className="px-4 py-3 text-center">{game.min}</td>
                                            <td className="px-4 py-3 text-center">{game.fgm}</td>
                                            <td className="px-4 py-3 text-center">{game.fga}</td>
                                            <td className="px-4 py-3 text-center">{game.fgp}%</td>
                                            <td className="px-4 py-3 text-center">{game.ftm}</td>
                                            <td className="px-4 py-3 text-center">{game.fta}</td>
                                            <td className="px-4 py-3 text-center">{game.ftp}%</td>
                                            <td className="px-4 py-3 text-center">{game.offReb}</td>
                                            <td className="px-4 py-3 text-center">{game.defReb}</td>
                                            <td className="px-4 py-3 text-center">{game.totReb}</td>
                                            <td className="px-4 py-3 text-center">{game.assists}</td>
                                            <td className="px-4 py-3 text-center">{game.steals}</td>
                                            <td className="px-4 py-3 text-center">{game.blocks}</td>
                                            <td className="px-4 py-3 text-center">{game.fouls}</td>
                                            <td className="px-4 py-3 text-center">{game.turnovers}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-600">
                        No stats available for this player.
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link href={`/players/${params.id}/predict`}>
                        <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg 
                                         hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 
                                         shadow-md hover:shadow-lg">
                            Predict a Statistic For Betting
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
