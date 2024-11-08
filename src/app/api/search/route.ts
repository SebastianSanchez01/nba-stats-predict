/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  console.log("Search query received:", query);

  try {
    const db = await connectToDatabase();

    const searchTerms = query.trim().split(" ");
    const firstName = searchTerms[0];
    const lastName = searchTerms.length > 1 ? searchTerms[1] : null;

    let playerQuery: any;
    let teamQuery: any;

    if (lastName) {
      playerQuery = {
        $and: [
          { firstname: { $regex: new RegExp(firstName, "i") } },
          { lastname: { $regex: new RegExp(lastName, "i") } },
        ],
      };
    } else {
      playerQuery = {
        $or: [
          { firstname: { $regex: new RegExp(firstName, "i") } },
          { lastname: { $regex: new RegExp(firstName, "i") } },
          { college: { $regex: new RegExp(firstName, "i") } },
        ],
      };
    }

    teamQuery = {
      $or: [
        { name: { $regex: new RegExp(query, "i") } },
        { code: { $regex: new RegExp(query, "i") } },
        { city: { $regex: new RegExp(query, "i") } },
      ],
    };

    const players = await db.collection("Player").find(playerQuery).toArray();
    const teams = await db.collection("Team").find(teamQuery).toArray();

    const playerResults = players.map((player: any) => ({
      type: "player",
      id: player.id,
      firstname: player.firstname,
      lastname: player.lastname,
      college: player.college,
    }));

    const teamResults = teams.map((team: any) => ({
      type: "team",
      id: team.id,
      name: team.name,
      code: team.code,
      city: team.city,
      logo: team.logo,
    }));

    const results = [...playerResults, ...teamResults];
    console.log("Search results:", results);

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("Error fetching search results:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch search results" }),
      {
        status: 500,
      }
    );
  }
}
