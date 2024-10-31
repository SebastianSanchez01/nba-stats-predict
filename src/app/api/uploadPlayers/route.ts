import { connectToDatabase } from '../../../../lib/mongodb';

interface RapidApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  response: Player[];
}

interface Player {
  id: number;
  firstname: string;
  lastname: string;
  birth: [];
  nba: [];
  height: [];
  weight: [];
  college: string;
  affiliation: string;
  leagues: [];
}

export async function POST() {
  try {
    // Connect to MongoDB
    const db = await connectToDatabase();

    // Prepare the API request
    // To use set team to a number instead of a question mark 
    const url = 'https://api-nba-v1.p.rapidapi.com/players?team=?&season=2024';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.RAPIDAPI_HOST as string,
        'x-rapidapi-key': process.env.RAPIDAPI_KEY as string
      }
    };

    // Fetch data from the NBA API
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API response error:', errorBody);
      throw new Error('Failed to fetch NBA player data');
    }

    const data = await response.json() as RapidApiResponse;
    const players: Player[] = data.response;

    // Log the player data to verify it
    console.log('Fetched players:', players);

    // Check if players array is empty
    if (players.length === 0) {
      return new Response(JSON.stringify({ error: 'No players found to upload' }), { status: 400 });
    }

    // Insert players into MongoDB
    const result = await db.collection('Player').insertMany(players);
    return new Response(JSON.stringify({ message: 'Players uploaded successfully!', insertedCount: result.insertedCount }), { status: 200 });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload NBA player data' }), { status: 500 });
  }
}
