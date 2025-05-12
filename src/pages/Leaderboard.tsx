
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Trophy, Award, Medal } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  teamName: string;
  playerName: string;
  kills: number;
  matches: number;
  wins: number;
  points: number;
}

const sampleLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, teamName: 'Elite Killers', playerName: 'SharpShooter', kills: 187, matches: 42, wins: 16, points: 1245 },
  { rank: 2, teamName: 'Phoenix Squad', playerName: 'FireRaider', kills: 165, matches: 39, wins: 13, points: 1120 },
  { rank: 3, teamName: 'Shadow Warriors', playerName: 'NightHawk', kills: 158, matches: 41, wins: 12, points: 1050 },
  { rank: 4, teamName: 'Dragon Force', playerName: 'DragonFist', kills: 152, matches: 40, wins: 11, points: 980 },
  { rank: 5, teamName: 'Thunder Assault', playerName: 'StormBreaker', kills: 140, matches: 38, wins: 10, points: 920 },
  { rank: 6, teamName: 'Venom Strike', playerName: 'ToxicSnipe', kills: 138, matches: 42, wins: 9, points: 890 },
  { rank: 7, teamName: 'Arctic Wolves', playerName: 'FrostyAim', kills: 132, matches: 39, wins: 8, points: 840 },
  { rank: 8, teamName: 'Crimson Tide', playerName: 'BloodHunter', kills: 129, matches: 41, wins: 8, points: 820 },
  { rank: 9, teamName: 'Raven Squad', playerName: 'ShadowRaven', kills: 125, matches: 40, wins: 7, points: 790 },
  { rank: 10, teamName: 'Phantom Ops', playerName: 'StealthKiller', kills: 120, matches: 38, wins: 7, points: 760 },
];

const Leaderboard = () => {
  const [leaderboard] = useState<LeaderboardEntry[]>(sampleLeaderboardData);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="font-bold">{rank}</span>;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Leaderboard | Free Fire Arena</title>
        <meta name="description" content="Check out the top players and teams in our Free Fire tournaments." />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">LEADERBOARD</h1>
        <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
        
        <div className="gaming-card p-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="py-3 px-4 text-gaming-orange">Rank</th>
                <th className="py-3 px-4 text-gaming-orange">Team</th>
                <th className="py-3 px-4 text-gaming-orange">Player</th>
                <th className="py-3 px-4 text-gaming-orange text-center">Kills</th>
                <th className="py-3 px-4 text-gaming-orange text-center">Matches</th>
                <th className="py-3 px-4 text-gaming-orange text-center">Wins</th>
                <th className="py-3 px-4 text-gaming-orange text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr 
                  key={entry.rank} 
                  className={`border-b border-gray-800 hover:bg-gray-900/50 transition-colors ${
                    entry.rank <= 3 ? 'animate-pulse-slow' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gaming-dark">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-white">{entry.teamName}</td>
                  <td className="py-4 px-4 text-gray-300">{entry.playerName}</td>
                  <td className="py-4 px-4 text-center text-gray-300">{entry.kills}</td>
                  <td className="py-4 px-4 text-center text-gray-300">{entry.matches}</td>
                  <td className="py-4 px-4 text-center text-gray-300">{entry.wins}</td>
                  <td className="py-4 px-4 text-center font-bold text-gaming-orange">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
