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
        <main className="container">
            <Header />
            <h1 className="text-4xl font-bold mb-4 text-center mt-20">
                {player.firstname} {player.lastname}
            </h1>
            <p>College: {player.college}</p>

            {sortedStats && sortedStats.length > 0 ? (
                <table className="table-auto w-full mt-8 text-center">
                    <thead>
                        <tr>
                            <th>Points</th>
                            <th>Minutes</th>
                            <th>FGM</th>
                            <th>FGA</th>
                            <th>FG%</th>
                            <th>FTM</th>
                            <th>FTA</th>
                            <th>FTP</th>
                            <th>offReb</th>
                            <th>defReb</th>
                            <th>totReb</th>
                            <th>Assists</th>
                            <th>Steals</th>
                            <th>Blocks</th>
                            <th>Fouls</th>
                            <th>Turnovers</th>
                         </tr>
                    </thead>
                    <tbody>
                        {sortedStats.map((game, index) => (
                            <tr key={index}>
                                <td>{game.points}</td>
                                <td>{game.min}</td>
                                <td>{game.fgm}</td>
                                <td>{game.fga}</td>
                                <td>{game.fgp}</td>
                                <td>{game.ftm}</td>
                                <td>{game.fta}</td>
                                <td>{game.ftp}</td>
                                <td>{game.offReb}</td>
                                <td>{game.defReb}</td>
                                <td>{game.totReb}</td>
                                <td>{game.assists}</td>
                                <td>{game.steals}</td>
                                <td>{game.blocks}</td>
                                <td>{game.fouls}</td>
                                <td>{game.turnovers}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No stats available for this player.</p>
            )}

            <div className="mt-8 text-center">
                <Link href={`/players/${params.id}/predict`}>
                    <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
                        Predict a Statistic For Betting
                    </button>
                </Link>
            </div>
        </main>
    );
}
