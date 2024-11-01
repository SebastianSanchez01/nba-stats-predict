/* eslint-disable react/react-in-jsx-scope */
import { MongoClient, ObjectId } from 'mongodb';
import Header from "../../componenets/Header";

interface Player {
    _id: ObjectId;
    id: number;
    firstname: string;
    lastname: string;
    college: string;
}

async function getPlayerData(id: string): Promise<Player | null> {
    const client = await MongoClient.connect(process.env.MONGODB_URI || '');
    const db = client.db('NbaDB');

    try {
        console.log('Querying Player with id:', id);
        const numericId = Number(id);
        const playerDoc = await db.collection('Player').findOne({ id: numericId });

        console.log('Player Document:', playerDoc);

        if (!playerDoc) return null;

        return {
            _id: playerDoc._id,
            id: playerDoc.id,
            firstname: playerDoc.firstname,
            lastname: playerDoc.lastname,
            college: playerDoc.college,
        };
    } catch (error) {
        console.error("Error fetching player data:", error);
        return null;
    } finally {
        client.close();
    }
}

export default async function PlayerPage({ params }: { params: { id: string } }) {
    const player = await getPlayerData(params.id);

    if (!player) {
        return <p>Player not found</p>;
    }

    return (
        <main className="container">
            <Header />
            <h1 className="text-4xl font-bold mb-4 text-center mt-20">
                {player.firstname} {player.lastname}
                <p>College: {player.college}</p>
            </h1>
        </main>
    );
}


