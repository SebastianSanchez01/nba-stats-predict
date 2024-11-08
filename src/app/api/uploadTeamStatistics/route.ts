import { connectToDatabase } from "../../../../lib/mongodb";

interface RapidApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  response: Team_Statistics[];
}

interface Team_Statistics {
  teamID?: number;
  statID?: number;
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

export async function POST() {
  try {
    // Connect to MongoDB
    const db = await connectToDatabase();

    // Prepare the API request
    const teamID = 40;
    const url =
      "https://api-nba-v1.p.rapidapi.com/teams/statistics?id=" +
      teamID +
      "&season=2024";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-host": process.env.RAPIDAPI_HOST as string,
        "x-rapidapi-key": process.env.RAPIDAPI_KEY as string,
      },
    };

    // Fetch data from the NBA API
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API response error:", errorBody);
      throw new Error("Failed to fetch NBA team stat data");
    }

    const data = (await response.json()) as RapidApiResponse;
    const teamStatsData = data.response["0"];

    const teamStats: Team_Statistics = {
      teamID: teamID,
      statID: 100 + teamID,
      ...teamStatsData,
    };

    // Log the player data to verify it
    console.log("Fetched Teams:", teamStats);

    // Check if players array is empty
    if (teamStats === null) {
      return new Response(
        JSON.stringify({ error: "No Teams found to upload" }),
        { status: 400 }
      );
    }

    // Insert players into MongoDB
    const result = await db.collection("Team_Statistics").insertOne(teamStats);
    return new Response(
      JSON.stringify({ message: "Teams uploaded successfully!" + result }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload NBA Team data" }),
      { status: 500 }
    );
  }
}
