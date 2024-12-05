import { connectToDatabase } from '../../../../lib/mongodb';

type GameStats = {
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
  pFouls: number;
  steals: number;
  turnovers: number;
  blocks: number;
  plusMinus: string;
  comment: string | null;
};

// Function to introduce delay
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST() {
  try {
    const db = connectToDatabase();
    const playersCollection = (await db).collection('Player');
    const players = await playersCollection.find({}, { projection: { id: 1 } }).toArray();

    for (const player of players) {
      const playerID = player.id;
      console.log('Current player id' + playerID);
      const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?id=${playerID}&season=2024`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-host': process.env.RAPIDAPI_HOST as string,
          'x-rapidapi-key': process.env.RAPIDAPI_KEY as string
        }
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API response error:', errorBody);
        throw new Error('Failed to fetch NBA player data');
      }

      const data = await response.json();
      if (data.errors && data.errors.length > 0) {
        console.error(`Errors encountered for player ID ${playerID}:`, data.errors);
        continue;
      }

      const statsEntries = data.response.map((game: GameStats) => ({
        playerID,
        points: game.points,
        pos: game.pos,
        min: game.min,
        fgm: game.fgm,
        fga: game.fga,
        fgp: game.fgp,
        ftm: game.ftm,
        fta: game.fta,
        ftp: game.ftp,
        tpm: game.tpm,
        tpa: game.tpa,
        tpp: game.tpp,
        offReb: game.offReb,
        defReb: game.defReb,
        totReb: game.totReb,
        assists: game.assists,
        pFouls: game.pFouls,
        steals: game.steals,
        turnovers: game.turnovers,
        blocks: game.blocks,
        plusMinus: game.plusMinus,
        comment: game.comment, 
      }));

      const result = await (await db).collection('Player_Statistics').insertMany(statsEntries);
      console.log(result);
      // Delay for 12 seconds before moving to the next player to stay within rate limits
      await delay(6000);
    }

    return new Response(JSON.stringify({ message: 'Players stats uploaded successfully!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to upload NBA Team data' }), { status: 500 });
  }
}

