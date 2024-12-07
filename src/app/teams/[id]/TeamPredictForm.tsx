/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';

interface Team {
    id: number;
    name: string;
    code: string;
    city: string;
    logo: string;
}

export default function TeamPredictForm({ currentTeamId }: { currentTeamId: string }) {
    const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
    const [opposingTeam, setOpposingTeam] = useState<Team | null>(null);
    const [opposingTeamID, setOpposingTeamID] = useState('');

    const handlePrediction = async () => {
        console.log('i made it here');
        if (!currentTeamId || !opposingTeamID) {
            alert('Both teams must be selected for prediction.');
            return;
        }

        try {
            const response = await fetch('/api/predictions/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentTeamId,
                    opposingTeamId: opposingTeamID,
                    currentTeamName: currentTeam?.name,
                    opposingTeamName: opposingTeam?.name
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch prediction');
            }

            const predictionData = await response.json();
            alert(`Prediction: ${predictionData.message}`);
        } catch (error) {
            console.error('Error making prediction:', error);
            alert('An error occurred while generating the prediction. Please try again.');
        } 
    };

    useEffect(() => {
        const fetchCurrentTeam = async () => {
            try {
                const response = await fetch(`/api/teams/${currentTeamId}`);
                if (!response.ok) throw new Error('Failed to fetch team');
                const teamData = await response.json();
                setCurrentTeam(teamData);
            } catch (error) {
                console.error('Error fetching current team:', error);
            }
        };

        fetchCurrentTeam();
    }, [currentTeamId]);

    const handleTeamSelect = async (teamId: string) => {
        setOpposingTeamID(teamId);
        try {
            const response = await fetch(`/api/teams/${teamId}`);
            if (!response.ok) throw new Error('Failed to fetch team');
            const teamData = await response.json();
            
            if (!teamData) {
                console.error(`No team found for ID: ${teamId}`);
                return;
            }
            
            setOpposingTeam(teamData);
        } catch (error) {
            console.error('Error fetching opposing team:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex-1 text-center">
                        <div className="flex flex-col items-center">
                            <img
                                src={currentTeam?.logo}
                                alt={`${currentTeam?.name} logo`}
                                className="mx-auto my-4 h-20"
                            />
                            <h3 className="text-xl font-bold">{currentTeam?.name}</h3>
                        </div>
                    </div>

                    <div className="flex-shrink-0 px-8">
                        <span className="text-2xl font-bold text-black-400">VS</span>
                    </div>

                    <div className="flex-1 text-center">
                        {opposingTeam ? (
                            <div className="flex flex-col items-center">
                                <img
                                    src={opposingTeam.logo}
                                    alt={`${opposingTeam.name} logo`}
                                    className="mx-auto my-4 h-20"
                                />
                                <h3 className="text-xl font-bold">{opposingTeam.name}</h3>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="mx-auto my-4 h-20 flex items-center justify-center">
                                    <span className="text-gray-400">Select Team</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-400">Opponent</h3>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                        Select Your Opponent
                    </h2>

                    <select
                        value={opposingTeamID}
                        onChange={(e) => handleTeamSelect(e.target.value)}
                        className="block w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-3 
                                  bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                  transition-all duration-200"
                    >
                        <option value="">Choose a team to compete against...</option>
                            <option value="1">Atlanta Hawks</option>
                            <option value="2">Boston Celtics</option>
                            <option value="4">Brooklyn Nets</option>
                            <option value="5">Charlotte Hornets</option>
                            <option value="6">Chicago Bulls</option>
                            <option value="7">Cleveland Cavaliers</option>
                            <option value="10">Detroit Pistons</option>
                            <option value="15">Indiana Pacers</option>
                            <option value="20">Miami Heat</option>
                            <option value="21">Milwaukee Bucks</option>
                            <option value="24">New York Knicks</option>
                            <option value="26">Orlando Magic</option>
                            <option value="27">Philadelphia 76ers</option>
                            <option value="38">Toronto Raptors</option>
                            <option value="41">Washington Wizards</option>
                            <option value="8">Dallas Mavericks</option>
                            <option value="9">Denver Nuggets</option>
                            <option value="11">Golden State Warriors</option>
                            <option value="14">Houston Rockets</option>
                            <option value="16">LA Clippers</option>
                            <option value="17">Los Angeles Lakers</option>
                            <option value="19">Memphis Grizzlies</option>
                            <option value="22">Minnesota Timberwolves</option>
                            <option value="23">New Orleans Pelicans</option>
                            <option value="25">Oklahoma City Thunder</option>
                            <option value="28">Phoenix Suns</option>
                            <option value="29">Portland Trail Blazers</option>
                            <option value="30">Sacramento Kings</option>
                            <option value="31">San Antonio Spurs</option>
                            <option value="40">Utah Jazz</option>
                    </select>

                    {opposingTeamID && (
                        <div className="mt-8">
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold 
                                         py-3 px-6 rounded-lg transition-all duration-200 
                                         transform hover:scale-[1.02] hover:shadow-lg 
                                         active:scale-[0.98] focus:outline-none focus:ring-2 
                                         focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => {
                                    console.log('Making prediction for teams:', currentTeamId, opposingTeamID);
                                    handlePrediction();

                                }}
                            >
                                Generate Prediction
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}