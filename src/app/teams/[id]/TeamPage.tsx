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

            {stats && stats.length > 0 ? (
                <table className="table-auto w-full mt-8 text-center">
                    <thead>
                        <tr>
                            <th>Games</th>
                            <th>Fast Break Points</th>
                            <th>Points In Paint</th>
                            <th>Biggest Lead</th>
                            <th>Second Chance Points</th>
                            <th>Points Off Turnovers</th>
                            <th>Points</th>
                            <th>Assists</th>
                            <th>Rebounds</th>
                            <th>Steals</th>
                            <th>Blocks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((stat, index) => (
                            <tr key={index}>
                                <td>{stat.games}</td>
                                <td>{stat.fastBreakPoints}</td>
                                <td>{stat.pointsInPaint}</td>
                                <td>{stat.biggestLead}</td>
                                <td>{stat.secondChancePoints}</td>
                                <td>{stat.pointsOffTurnovers}</td>
                                <td>{stat.points}</td>
                                <td>{stat.assists}</td>
                                <td>{stat.totReb}</td>
                                <td>{stat.steals}</td>
                                <td>{stat.blocks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No stats available for this team.</p>
            )}
        </main>
    );
}

