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

    let mongoQuery: any;

    if (lastName) {
      mongoQuery = {
        $and: [
          { firstname: { $regex: new RegExp(firstName, "i") } },
          { lastname: { $regex: new RegExp(lastName, "i") } },
        ],
      };
    } else {
      mongoQuery = {
        $or: [
          { firstname: { $regex: new RegExp(firstName, "i") } },
          { lastname: { $regex: new RegExp(firstName, "i") } },
          { college: { $regex: new RegExp(firstName, "i") } },
        ],
      };
    }

    const players = await db.collection("Player").find(mongoQuery).toArray();
    console.log("Players found:", players);

    return new Response(JSON.stringify(players), { status: 200 });
  } catch (error) {
    console.error("Error fetching players:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch players" }), {
      status: 500,
    });
  }
}
