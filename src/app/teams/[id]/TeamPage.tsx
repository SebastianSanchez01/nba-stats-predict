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
        <main className="container">
            <Header />
            <h1 className="text-4xl font-bold mb-4 text-center mt-20">
                {team.name} ({team.code})
            </h1>
            <p className="text-center">City: {team.city}</p>
            <img src={team.logo} alt={`${team.name} logo`} className="mx-auto my-4 h-20" />
            <h1 className="text-2xl font-bold mb-4 text-center mt-20">
                2024-2025 Season Stats
            </h1>
            {stats && stats.length > 0 ? (
                <>
                    <table className="table-auto w-full mt-8 text-center">
                        <thead>
                            <tr>
                            <th>Games</th>
                            <th>Points</th>
                            <th>Fga</th>
                            <th>Fgm</th>
                            <th>Fgp</th>
                            <th>Assists</th>
                            <th>offReb</th>
                            <th>defReb</th>
                            <th>totReb</th>
                            <th>Steals</th>
                            <th>Blocks</th>
                            <th>Turnovers</th>
                            <th>+/-</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((stat, index) => (
                                <tr key={index}>
                                <td>{stat.games}</td>
                                <td>{stat.points}</td>
                                <td>{stat.fga}</td>
                                <td>{stat.fgm}</td>
                                <td>{stat.fgp}</td>
                                <td>{stat.assists}</td>
                                <td>{stat.offReb}</td>
                                <td>{stat.defReb}</td>
                                <td>{stat.totReb}</td>
                                <td>{stat.steals}</td>
                                <td>{stat.blocks}</td>
                                <td>{stat.turnovers}</td>
                                <td>{stat.plusMinus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-center mt-6">
                        <Link
                            href={`/teams/${params.id}/TeamPredictForm`}
                            className="bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Predict a bet
                        </Link>
                    </div>
                </>
            ) : (
                <p>No stats available for this team.</p>
            )}
        </main>
    );
}