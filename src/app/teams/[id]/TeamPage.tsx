/* eslint-disable react/react-in-jsx-scope */
import Header from "../../components/Header";
import { getTeamData, getTeamStats } from "./page";
import Link from 'next/link';

export default async function TeamPage({ params }: { params: { id: string } }) {
    const team = await getTeamData(params.id);
    const stats = await getTeamStats(params.id);

    if (!team) {
        return <p>Team not found</p>;
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
                        {team.name} ({team.code})
                    </h1>
                    <p className="text-center text-gray-600 mb-4">
                        City: {team.city}
                    </p>
                    <img
                        src={team.logo}
                        alt={`${team.name} logo`}
                        className="mx-auto h-24 object-contain"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        2024-2025 Season Stats
                    </h2>

                    {stats && stats.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="px-4 py-3">Games</th>
                                        <th className="px-4 py-3">Points</th>
                                        <th className="px-4 py-3">FGA</th>
                                        <th className="px-4 py-3">FGM</th>
                                        <th className="px-4 py-3">FG%</th>
                                        <th className="px-4 py-3">Assists</th>
                                        <th className="px-4 py-3">OReb</th>
                                        <th className="px-4 py-3">DReb</th>
                                        <th className="px-4 py-3">TReb</th>
                                        <th className="px-4 py-3">Steals</th>
                                        <th className="px-4 py-3">Blocks</th>
                                        <th className="px-4 py-3">TO</th>
                                        <th className="px-4 py-3">+/-</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {stats.map((stat, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-center">{stat.games}</td>
                                            <td className="px-4 py-3 text-center font-semibold">{stat.points}</td>
                                            <td className="px-4 py-3 text-center">{stat.fga}</td>
                                            <td className="px-4 py-3 text-center">{stat.fgm}</td>
                                            <td className="px-4 py-3 text-center">{stat.fgp}%</td>
                                            <td className="px-4 py-3 text-center">{stat.assists}</td>
                                            <td className="px-4 py-3 text-center">{stat.offReb}</td>
                                            <td className="px-4 py-3 text-center">{stat.defReb}</td>
                                            <td className="px-4 py-3 text-center">{stat.totReb}</td>
                                            <td className="px-4 py-3 text-center">{stat.steals}</td>
                                            <td className="px-4 py-3 text-center">{stat.blocks}</td>
                                            <td className="px-4 py-3 text-center">{stat.turnovers}</td>
                                            <td className="px-4 py-3 text-center">{stat.plusMinus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">
                            No stats available for this team.
                        </p>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link href={`/teams/${params.id}/TeamPredictForm`}>
                        <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg 
                                         hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 
                                         shadow-md hover:shadow-lg">
                            Predict a Game Outcome
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}