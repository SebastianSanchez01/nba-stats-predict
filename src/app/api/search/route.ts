import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  console.log("Search query received:", query);

  try {
    const db = await connectToDatabase();
    const players = await db
      .collection("Player")
      .find({
        $or: [
          { firstname: { $regex: query, $options: "i" } },
          { lastname: { $regex: query, $options: "i" } },
          { college: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    console.log("Players found:", players);

    return new Response(JSON.stringify(players), { status: 200 });
  } catch (error) {
    console.error("Error fetching players:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch players" }), {
      status: 500,
    });
  }
}
