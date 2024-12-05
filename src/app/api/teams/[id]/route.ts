import { NextResponse } from 'next/server';
import { getTeamData } from '@/app/teams/[id]/page';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('API Route - Requested Team ID:', params.id);
        const teamData = await getTeamData(params.id);
        console.log('API Route - Retrieved Team Data:', teamData);
        return NextResponse.json(teamData);
    } catch (error) {
        console.error('API Route - Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch team data' },
            { status: 500 }
        );
    }
} 