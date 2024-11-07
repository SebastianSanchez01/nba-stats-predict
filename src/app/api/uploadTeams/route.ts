import { connectToDatabase } from '../../../../lib/mongodb';

interface RapidApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  response: Team[];
}

interface Team {
    id: number;
    name: string;
    code: string;
    city: string;
    logo: string;
    allStar: boolean;
    nbaFranchise: boolean;
    leagues: [];
}

export async function POST() {
  try {
    // Connect to MongoDB
    const db = await connectToDatabase();

    // Prepare the API request
    const url = 'https://api-nba-v1.p.rapidapi.com/teams?conference=West';
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
    const teams: Team[] = data.response;

    // Log the player data to verify it
    console.log('Fetched Teams:', teams);

    // Check if players array is empty
    if (teams.length === 0) {
      return new Response(JSON.stringify({ error: 'No Teams found to upload' }), { status: 400 });
    }

    // Insert players into MongoDB
    const result = await db.collection('Team').insertMany(teams);
    return new Response(JSON.stringify({ message: 'Teams uploaded successfully!', insertedCount: result.insertedCount }), { status: 200 });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload NBA Team data' }), { status: 500 });
  }
}
