import { NextResponse } from 'next/server';
import { connectToDatabase } from "../../../../../lib/mongodb";

// Probability Calculator Class
class PlayerStatProbabilityCalculator {
    calculateProbability(params: PlayerStatProbabilityParams): number {
      const {
        spread,
        choice,
        opposingTeamPlusMinus,
        lastFiveGames
      } = params;

      // Calculate basic statistics
      const mean = this.calculateMean(lastFiveGames);
      const standardDeviation = this.calculateStandardDeviation(lastFiveGames, mean);
      
      // Adjust probability based on opposing team's defensive rating
      const defensiveAdjustment = this.calculateDefensiveAdjustment(opposingTeamPlusMinus);
      
      // Calculate z-score
      const zScore = this.calculateZScore(spread, mean, standardDeviation, defensiveAdjustment);
      
      // Calculate probability using standard normal distribution
      const probability = this.calculateNormalDistributionProbability(zScore, choice);
      
      // Ensure probability is within 0-100 range
      return Math.max(0, Math.min(100, probability));
    }
  
    private calculateMean(values: number[]): number {
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    }
  
    private calculateStandardDeviation(values: number[], mean: number): number {
      const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
      return Math.sqrt(variance);
    }
  
    private calculateDefensiveAdjustment(opposingTeamPlusMinus: number): number {
      const adjustment = -opposingTeamPlusMinus / 400;
      return Math.max(-0.5, Math.min(0.5, adjustment));
    }
  
    private calculateZScore(
      spread: number, 
      mean: number, 
      standardDeviation: number,
      defensiveAdjustment: number
    ): number {
      const adjustedMean = mean * (1 + defensiveAdjustment);
      return (spread - adjustedMean) / standardDeviation;
    }
  
    private calculateNormalDistributionProbability(zScore: number, choice: 'over' | 'under'): number {
      const cumulativeProbability = this.normalCumulativeProbability(zScore);
      
      return choice === 'over' 
        ? (1 - cumulativeProbability) * 100 
        : cumulativeProbability * 100;
    }
  
    private normalCumulativeProbability(z: number): number {
      const b1 = 0.319381530;
      const b2 = -0.356563782;
      const b3 = 1.781477937;
      const b4 = -1.821255978;
      const b5 = 1.330274429;
      const p = 0.2316419;
      
      const sign = z < 0 ? -1 : 1;
      const absZ = Math.abs(z);
      
      const t = 1 / (1 + p * absZ);
      const series = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
      
      return sign > 0 
        ? 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-z * z / 2) * series 
        : 1 - this.normalCumulativeProbability(-z);
    }
  }
  
  // TypeScript Interfaces
  interface PlayerStatProbabilityParams {
    statistic: 'points' | 'assists' | 'rebounds' | 'blocks' | 'turnovers';
    spread: number;
    choice: 'over' | 'under';
    opposingTeamPlusMinus: number;
    lastFiveGames: number[];
  }
  

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { playerID, statistic, spread, opposingTeamID, choice  } = body;
        console.log(body);

        if (!playerID || !statistic || spread === undefined || !opposingTeamID || !choice) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await connectToDatabase();

        // Fetch the last 5 game stats for the player
        const playerStats = await db
            .collection('Player_Statistics')
            .find({ playerID: playerID})
            .sort({['_id'] : -1})
            .limit(5)
            .toArray();

        if (!playerStats.length) {
            console.log('i made it here');
            return NextResponse.json({ error: 'No game statistics found for this player' }, { status: 404 });
        }

        const lastFiveGames = playerStats.map(stat => stat[statistic]).slice(0, 5);


        // Fetch the opposing team's season stats
        const opposingTeamStats = await db
            .collection('Team_Statistics')
            .findOne({ teamID: opposingTeamID });

        if (!opposingTeamStats) {
            console.log(opposingTeamID);
            console.log('i made it here 2');
            return NextResponse.json({ error: 'Opposing team statistics not found' }, { status: 404 });
        }

                // Calculate probability
        const probabilityCalculator = new PlayerStatProbabilityCalculator();
        const probability = probabilityCalculator.calculateProbability({
            statistic,
            spread,
            choice,
            opposingTeamPlusMinus: opposingTeamStats.plusMinus || 0,
            lastFiveGames
        });
        
        

        return NextResponse.json({
            playerID,
            statistic,
            spread,
            choice,
            probability: (probability / 100),
        });

    } catch (error) {
        console.error('Error in prediction route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
