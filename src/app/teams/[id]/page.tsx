/* eslint-disable react/react-in-jsx-scope */
import { MongoClient, Document, ObjectId } from 'mongodb';
import TeamPage from "./TeamPage";

interface Team {
    _id: ObjectId;
    id: number;
    name: string;
    code: string;
    city: string;
    logo: string;
    allStar: boolean;
    nbaFranchise: boolean;
    leagues: [];
}

interface TeamStatistics {
    teamID: number;
    games: number;
    fastBreakPoints: number;
    pointsInPaint: number;
    biggestLead: number;
    secondChancePoints: number;
    pointsOffTurnovers: number;
    longestRun: number;
    points: number;
    fgm: number;
    fga: number;
    fgp: number;
    ftm: number;
    fta: number;
    ftp: number;
    tpm: number;
    tpa: number;
    tpp: number;
    offReb: number;
    defReb: number;
    totReb: number;
    assists: number;
    pFouls: number;
    steals: number;
    turnovers: number;
    blocks: number;
    plusMinus: number;
}

export async function getTeamData(id: string): Promise<Team | null> {
    const client = await MongoClient.connect(process.env.MONGODB_URI || '');
    const db = client.db('NbaDB');

    try {
        const numericId = Number(id);
        const teamDoc = await db.collection('Team').findOne({ id: numericId });
        if (!teamDoc) return null;

        return {
            _id: teamDoc._id,
            id: teamDoc.id,
            name: teamDoc.name,
            code: teamDoc.code,
            city: teamDoc.city,
            logo: teamDoc.logo,
            allStar: teamDoc.allStar,
            nbaFranchise: teamDoc.nbaFranchise,
            leagues: teamDoc.leagues,
        };
    } catch (error) {
        console.error("Error fetching team data:", error);
        return null;
    } finally {
        client.close();
    }
}

export async function getTeamStats(id: string): Promise<TeamStatistics[] | null> {
    const client = await MongoClient.connect(process.env.MONGODB_URI || '');
    const db = client.db('NbaDB');

    try {
        const numericId = Number(id);
        const statsDocs = await db.collection('Team_Statistics')
            .find({ teamID: numericId })
            .toArray();

        const stats: TeamStatistics[] = statsDocs.map((doc: Document) => ({
            teamID: doc.teamID,
            games: doc.games,
            fastBreakPoints: doc.fastBreakPoints,
            pointsInPaint: doc.pointsInPaint,
            biggestLead: doc.biggestLead,
            secondChancePoints: doc.secondChancePoints,
            pointsOffTurnovers: doc.pointsOffTurnovers,
            longestRun: doc.longestRun,
            points: doc.points,
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
            pFouls: doc.pFouls,
            steals: doc.steals,
            turnovers: doc.turnovers,
            blocks: doc.blocks,
            plusMinus: doc.plusMinus,
        }));

        return stats;
    } catch (error) {
        console.error("Error fetching team stats:", error);
        return null;
    } finally {
        client.close();
    }
}

export default function PageWrapper({ params }: { params: { id: string } }) {
    return <TeamPage params={params} />;
}
