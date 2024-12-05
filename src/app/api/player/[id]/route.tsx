// app/api/players/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from "../../../../../lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase();
    console.log('connected to db');
    const numericId = Number(params.id);
    console.log('Searching for player ID:', numericId);
    
    // Use findOne instead of find, and match the id directly
    const player = await db.collection("Player").findOne({ id: numericId });
    
    if (!player) {
      console.log('No player found with ID:', numericId);
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}