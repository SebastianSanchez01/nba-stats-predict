import { NextResponse } from 'next/server';
import { connectToDatabase } from "../../../../../lib/mongodb";


    interface TeamStats {
        points: number;
        fgm: number;
        fga: number;
        fgp: number;
        ftm: number;
        fta: number;
        ftp: number;
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

class TeamWinProbabilityCalculator {
  // Calculate win probability
  calculateWinProbability(currentTeam: TeamStats, opposingTeam: TeamStats): number {
    // Validate input
    this.validateTeamStats(currentTeam);
    this.validateTeamStats(opposingTeam);

    // Calculate weighted scores for key statistical categories
    const offenseScore = this.calculateOffenseScore(currentTeam, opposingTeam);
    const defenseScore = this.calculateDefenseScore(currentTeam, opposingTeam);
    const reboundingScore = this.calculateReboundingScore(currentTeam, opposingTeam);
    const turnoversScore = this.calculateTurnoversScore(currentTeam, opposingTeam);
    const plusMinusScore = this.calculatePlusMinusScore(currentTeam, opposingTeam);

    // Combine scores with weighted average
    const combinedScore = this.calculateCombinedScore(
      offenseScore, 
      defenseScore, 
      reboundingScore, 
      turnoversScore, 
      plusMinusScore
    );

    // Convert combined score to probability
    return this.convertScoreToProbability(combinedScore);
  }

  // Validate team statistics input
  private validateTeamStats(team: TeamStats): void {
    const requiredFields: (keyof TeamStats)[] = [
      'points', 'fgm', 'fga', 'fgp', 'ftm', 'fta', 'ftp', 
      'offReb', 'defReb', 'totReb', 'assists', 'pFouls', 
      'steals', 'turnovers', 'blocks', 'plusMinus'
    ];

    requiredFields.forEach(field => {
      if (team[field] === undefined || team[field] === null) {
        throw new Error(`Missing or invalid team statistic: ${field}`);
      }
    });
  }

  // Calculate offensive score comparison
  private calculateOffenseScore(currentTeam: TeamStats, opposingTeam: TeamStats): number {
    // Compare field goal percentage
    const fgpDiff = currentTeam.fgp - opposingTeam.fgp;
    
    // Compare points scored
    const pointsDiff = currentTeam.points - opposingTeam.points;
    
    // Compare assists (indicator of team play)
    const assistsDiff = currentTeam.assists - opposingTeam.assists;

    // Weighted calculation
    return (
      (fgpDiff * 0.4) +  // Field goal percentage most important
      (pointsDiff / Math.max(opposingTeam.points, 1) * 0.3) +  // Relative points scoring
      (assistsDiff / Math.max(opposingTeam.assists, 1) * 0.3)  // Team play importance
    );
  }

  // Calculate defensive score comparison
  private calculateDefenseScore(currentTeam: TeamStats, opposingTeam: TeamStats): number {
    // Compare blocks
    const blocksDiff = currentTeam.blocks - opposingTeam.blocks;
    
    // Compare steals
    const stealsDiff = currentTeam.steals - opposingTeam.steals;
    
    // Compare personal fouls (lower is better)
    const foulsDiff = opposingTeam.pFouls - currentTeam.pFouls;

    // Weighted calculation
    return (
      (blocksDiff / Math.max(opposingTeam.blocks, 1) * 0.4) +
      (stealsDiff / Math.max(opposingTeam.steals, 1) * 0.3) +
      (foulsDiff / Math.max(opposingTeam.pFouls, 1) * 0.3)
    );
  }

  // Calculate rebounding score comparison
  private calculateReboundingScore(currentTeam: TeamStats, opposingTeam: TeamStats): number {
    // Compare offensive and defensive rebounds
    const offRebDiff = currentTeam.offReb - opposingTeam.offReb;
    const defRebDiff = currentTeam.defReb - opposingTeam.defReb;
    const totalRebDiff = currentTeam.totReb - opposingTeam.totReb;

    // Weighted calculation
    return (
      (offRebDiff / Math.max(opposingTeam.offReb, 1) * 0.4) +
      (defRebDiff / Math.max(opposingTeam.defReb, 1) * 0.3) +
      (totalRebDiff / Math.max(opposingTeam.totReb, 1) * 0.3)
    );
  }

  // Calculate turnovers score comparison
  private calculateTurnoversScore(currentTeam: TeamStats, opposingTeam: TeamStats): number {
    // Lower turnovers and more forced turnovers are better
    const turnoversDiff = opposingTeam.turnovers - currentTeam.turnovers;

    // Weighted against total team possessions
    return turnoversDiff / Math.max(opposingTeam.turnovers, 1);
  }

  // Calculate plus-minus score comparison
  private calculatePlusMinusScore(currentTeam: TeamStats, opposingTeam: TeamStats): number {
    // Direct comparison of plus-minus
    const plusMinusDiff = currentTeam.plusMinus - opposingTeam.plusMinus;

    // Normalize within expected range
    return plusMinusDiff / 400;
  }

  // Combine individual scores
  private calculateCombinedScore(
    offenseScore: number, 
    defenseScore: number, 
    reboundingScore: number, 
    turnoversScore: number, 
    plusMinusScore: number
  ): number {
    // Weighted average of different performance aspects
    return (
      (offenseScore * 0.35) +  // Offense most important
      (defenseScore * 0.25) +  // Defense crucial
      (reboundingScore * 0.2) +  // Rebounding significant
      (turnoversScore * 0.1) +  // Turnovers matter
      (plusMinusScore * 0.1)    // Overall team performance indicator
    );
  }

  // Convert combined score to win probability
  private convertScoreToProbability(combinedScore: number): number {
    // Use sigmoid function to convert score to probability
    // Ensures output is between 0 and 1
    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
    
    // Adjust sigmoid to center around 0.5 and scale appropriately
    const probability = sigmoid(combinedScore * 5);

    // Convert to percentage and round to two decimal places
    return Math.min(Math.max(probability * 100, 0), 100);
  }
}


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentTeamId, opposingTeamId, currentTeamName, opposingTeamName } = body;
        console.log(body);

        if (!currentTeamId || !opposingTeamId || !currentTeamName || !opposingTeamName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await connectToDatabase();

        // Fetch the opposing team's season stats
        const currentTeamStats = await db
            .collection('Team_Statistics')
            .findOne({ teamID: Number(currentTeamId) });

        if (!currentTeamStats) {
            console.log(currentTeamId);
            console.log('i made it here 2');
            return NextResponse.json({ error: 'Opposing team statistics not found' }, { status: 404 });
        }
        


        // Fetch the opposing team's season stats
        const opposingTeamStats = await db
            .collection('Team_Statistics')
            .findOne({ teamID: Number(opposingTeamId) });

        if (!opposingTeamStats) {
            console.log(opposingTeamId);
            console.log('i made it here 2');
            return NextResponse.json({ error: 'Opposing team statistics not found' }, { status: 404 });
        }

        const currentTeam = {
            points: currentTeamStats.points,
            fgm: currentTeamStats.fgm,
            fga: currentTeamStats.fga,
            fgp: currentTeamStats.fgp,
            ftm: currentTeamStats.ftm,
            fta: currentTeamStats.fta,
            ftp: currentTeamStats.ftp,
            offReb: currentTeamStats.offReb,
            defReb: currentTeamStats.defReb,
            totReb: currentTeamStats.totReb,
            assists: currentTeamStats.assists,
            pFouls: currentTeamStats.pFouls,
            steals: currentTeamStats.steals,
            turnovers: currentTeamStats.turnovers,
            blocks: currentTeamStats.blocks,
            plusMinus: currentTeamStats.plusMinus
        };

        const opposingTeam = {
            points: opposingTeamStats.points,
            fgm: opposingTeamStats.fgm,
            fga: opposingTeamStats.fga,
            fgp: opposingTeamStats.fgp,
            ftm: opposingTeamStats.ftm,
            fta: opposingTeamStats.fta,
            ftp: opposingTeamStats.ftp,
            offReb: opposingTeamStats.offReb,
            defReb: opposingTeamStats.defReb,
            totReb: opposingTeamStats.totReb,
            assists: opposingTeamStats.assists,
            pFouls: opposingTeamStats.pFouls,
            steals: opposingTeamStats.steals,
            turnovers: opposingTeamStats.turnovers,
            blocks: opposingTeamStats.blocks,
            plusMinus: opposingTeamStats.plusMinus
        };  

        const winProbabilityCalculator = new TeamWinProbabilityCalculator();

        const winProbability = winProbabilityCalculator.calculateWinProbability(
            currentTeam, 
            opposingTeam
        );

        const message = (`Probability of ${currentTeamName} winning against ${opposingTeamName} is: ${winProbability.toFixed(2)}%`);

        return NextResponse.json({
            message
        });

    } catch (error) {
        console.error('Error in prediction route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
