import { NextResponse } from 'next/server';
import { connectToDatabase } from "../../../../../lib/mongodb";
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { playerID, statistic, spread, opposingTeamID, choice  } = body;
        console.log(body);

        if (!playerID || !statistic || spread === undefined || !opposingTeamID || !choice) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await connectToDatabase();

        // Fetch the last 10 game stats for the player
        const playerStats = await db
            .collection('Player_Statistics')
            .find({ playerID: playerID})
            .sort({['_id'] : -1})
            .limit(10)
            .toArray();

        if (!playerStats.length) {
            console.log('i made it here');
            return NextResponse.json({ error: 'No game statistics found for this player' }, { status: 404 });
        }

        // Fetch the opposing team's season stats
        const opposingTeamStats = await db
            .collection('Team_Statistics')
            .findOne({ teamID: opposingTeamID });

        if (!opposingTeamStats) {
            console.log(opposingTeamID);
            console.log('i made it here 2');
            return NextResponse.json({ error: 'Opposing team statistics not found' }, { status: 404 });
        }

        // Calculate weights for the last 10 games (e.g., more recent games have higher weight)
        const weights = playerStats.map((_, index) => 1 - index * 0.01); // Decreasing weights
        const normalizedWeights = weights.map(w => w / weights.reduce((a, b) => a + b, 0)); // Normalize to sum 1

        // Calculate weighted average for the selected statistic
        const weightedStatSum = playerStats.reduce((sum, game, index) => {
            console.log(game[statistic]);
            return sum + game[statistic] * normalizedWeights[index];
        }, 0);

        // Incorporate opposing team's season stats
        const opposingTeamStat = opposingTeamStats.plusMinus * 0.01; // Example: points allowed
        const finalValue = weightedStatSum - opposingTeamStat + (choice === 'over' ? spread : -spread);

        // Apply activation function (e.g., sigmoid or ReLU)
        const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
        const probability = sigmoid(finalValue);
/*
        // Improved weighting scheme using exponential decay
        const decayFactor = 0.1; // Adjust for how quickly weights decrease
        const weights = playerStats.map((_, index) => Math.exp(-decayFactor * index));
        const normalizedWeights = weights.map(w => w / weights.reduce((a, b) => a + b, 0));

        // Calculate weighted average for the selected statistic
        const weightedStatSum = playerStats.reduce((sum, game, index) => {
            return sum + game[statistic] * normalizedWeights[index];
        }, 0);

        // Incorporate opposing team's defensive stats more meaningfully
        const opposingTeamDefenseEffect = opposingTeamStats.plusMinus / 100; // Scale appropriately
        const scaledSpread = spread / 10; // Scale spread to match the range of other inputs

        // Final value calculation with better scaling
        const finalValue = weightedStatSum - opposingTeamDefenseEffect + (choice === 'over' ? scaledSpread : -scaledSpread);

        // Apply sigmoid function with optional scaling to prevent extreme outputs
        const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
        const scaledFinalValue = Math.max(-6, Math.min(finalValue, 6)); // Clip values to [-6, 6] to avoid saturation
        const probability = sigmoid(scaledFinalValue);
*/


        return NextResponse.json({
            playerID,
            statistic,
            spread,
            choice,
            probability,
        });
    } catch (error) {
        console.error('Error in prediction route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
