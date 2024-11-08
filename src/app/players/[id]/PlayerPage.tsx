/* eslint-disable react/react-in-jsx-scope */
import Header from "../../components/Header";
import { getPlayerData, getPlayerStats } from "./page"; 

export default async function PlayerPage({ params }: { params: { id: string } }) {
    const player = await getPlayerData(params.id);
    const stats = await getPlayerStats(params.id);

    if (!player) {
        return <p>Player not found</p>;
    }

    return (
        <main className="container">
            <Header />
            <h1 className="text-4xl font-bold mb-4 text-center mt-20">
                {player.firstname} {player.lastname}
            </h1>
            <p>College: {player.college}</p>

            {stats && stats.length > 0 ? (
                <table className="table-auto w-full mt-8 text-center">
                    <thead>
                        <tr>
                            <th>Points</th>
                            <th>Position</th>
                            <th>Minutes</th>
                            <th>FGM</th>
                            <th>FGA</th>
                            <th>FG%</th>
                            <th>Assists</th>
                            <th>Rebounds</th>
                            <th>Steals</th>
                            <th>Blocks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((game, index) => (
                            <tr key={index}>
                                <td>{game.points}</td>
                                <td>{game.pos}</td>
                                <td>{game.min}</td>
                                <td>{game.fgm}</td>
                                <td>{game.fga}</td>
                                <td>{game.fgp}</td>
                                <td>{game.assists}</td>
                                <td>{game.totReb}</td>
                                <td>{game.steals}</td>
                                <td>{game.blocks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No stats available for this player.</p>
            )}
        </main>
    );
}
