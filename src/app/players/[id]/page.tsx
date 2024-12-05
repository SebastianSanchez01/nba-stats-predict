/* eslint-disable react/react-in-jsx-scope */
import { MongoClient, ObjectId, Document, WithId } from 'mongodb';
import PlayerPage from "./PlayerPage";

interface Player {
    _id: ObjectId;
    id: number;
    firstname: string;
    lastname: string;
    college: string;
}

interface GameStats {
    points: number;
    pos: string;
    min: string;
    fgm: number;
    fga: number;
    fgp: string;
    ftm: number;
    fta: number;
    ftp: string;
    tpm: number;
    tpa: number;
    tpp: string;
    offReb: number;
    defReb: number;
    totReb: number;
    assists: number;
    fouls: number;
    steals: number;
    turnovers: number;
    blocks: number;
    plusMinus: string;
    comment: string | null;
}

export async function getPlayerData(id: string): Promise<Player | null> {
    const client = await MongoClient.connect(process.env.MONGODB_URI || '');
    const db = client.db('NbaDB');

    try {
        const numericId = Number(id);
        const playerDoc = await db.collection('Player').findOne({ id: numericId });
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

export async function getPlayerStats(id: string): Promise<GameStats[] | null> {
    const client = await MongoClient.connect(process.env.MONGODB_URI || '');
    const db = client.db('NbaDB');

    try {
        const numericId = Number(id);
        const statsDocs = await db.collection('Player_Statistics')
            .find({ playerID: numericId })
            .toArray();

        const stats: GameStats[] = statsDocs.map((doc: WithId<Document>) => ({
            points: doc.points,
            pos: doc.pos,
            min: doc.min,
            fgm: doc.fgm,
            fga: doc.fga,
            fgp: doc.fgp,
            ftm: doc.ftm,
            fta: doc.fta,
            ftp: doc.ftp,
            tpm: doc.tpm,
            tpa: doc.tpa,
            tpp: doc.tpp,
            offReb: doc.offReb,
            defReb: doc.defReb,
            totReb: doc.totReb,
            assists: doc.assists,
            fouls: doc.pFouls,
            steals: doc.steals,
            turnovers: doc.turnovers,
            blocks: doc.blocks,
            plusMinus: doc.plusMinus,
            comment: doc.comment,
        }));

        return stats;
    } catch (error) {
        console.error("Error fetching player stats:", error);
        return null;
    } finally {
        client.close();
    }
}

export default function PageWrapper({ params }: { params: { id: string } }) {
    return <PlayerPage params={params} />;
}



