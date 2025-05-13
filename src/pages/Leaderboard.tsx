
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trophy, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Champion {
  id: string;
  tournamentId: string;
  tournamentName: string;
  teamName: string;
  captainName: string;
  players: { name: string; freeFireUID: string }[];
  heroImageURL: string;
  proofImageURL: string;
  tournamentDate: string;
  galleryMediaURLs: string[];
}

const Champions = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const championsCollection = collection(db, 'champions');
        const championsSnapshot = await getDocs(championsCollection);
        const championsList = championsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Champion[];
        
        // Sort by most recent tournament date
        championsList.sort((a, b) => {
          return new Date(b.tournamentDate).getTime() - new Date(a.tournamentDate).getTime();
        });
        
        setChampions(championsList);
      } catch (error) {
        console.error("Error fetching champions:", error);
        // Use sample data if Firebase fetch fails
        setChampions([
          {
            id: 'champ1',
            tournamentId: 'tourney_001',
            tournamentName: 'Weekly Tournament #25',
            teamName: 'Elite Squad',
            captainName: 'SharpShooter',
            players: [
              { name: 'SharpShooter', freeFireUID: '123456789' },
              { name: 'FlameWalker', freeFireUID: '987654321' },
              { name: 'ShadowBlade', freeFireUID: '456789123' },
              { name: 'StormRider', freeFireUID: '789123456' }
            ],
            heroImageURL: 'https://wallpapercave.com/wp/wp11213059.jpg',
            proofImageURL: 'https://wallpapercave.com/wp/wp9061729.jpg',
            tournamentDate: '2025-05-01',
            galleryMediaURLs: ['https://wallpapercave.com/wp/wp11213059.jpg', 'https://wallpapercave.com/wp/wp9061729.jpg']
          },
          {
            id: 'champ2',
            tournamentId: 'tourney_002',
            tournamentName: 'Elite Tournament #12',
            teamName: 'Phoenix Rising',
            captainName: 'FireRaider',
            players: [
              { name: 'FireRaider', freeFireUID: '223456789' },
              { name: 'ToxicSnake', freeFireUID: '887654321' },
              { name: 'GhostWalker', freeFireUID: '556789123' },
              { name: 'NinjaWarrior', freeFireUID: '889123456' }
            ],
            heroImageURL: 'https://wallpapercave.com/wp/wp9061730.jpg',
            proofImageURL: 'https://wallpapercave.com/wp/wp9061731.jpg',
            tournamentDate: '2025-04-15',
            galleryMediaURLs: ['https://wallpapercave.com/wp/wp9061730.jpg', 'https://wallpapercave.com/wp/wp9061731.jpg']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChampions();
  }, []);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Layout>
      <Helmet>
        <title>Champions | Free Fire Arena</title>
        <meta name="description" content="Celebrate the champions of our Free Fire tournaments" />
      </Helmet>
      
      <div className="container mx-auto py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Trophy className="text-gaming-orange" size={40} />
            CHAMPIONS
          </h1>
          <div className="w-32 h-1 bg-gaming-orange mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Celebrate the elite teams who conquered our tournaments. Witness the glory of champions who demonstrated exceptional skill, strategy, and teamwork.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-orange"></div>
          </div>
        ) : champions.length === 0 ? (
          <div className="gaming-card p-12 text-center">
            <Award className="text-gaming-orange mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-2">No Champions Yet</h3>
            <p className="text-gray-300 mb-6">
              Be the first to claim the champion title in one of our tournaments!
            </p>
            <Link to="/tournaments">
              <Button className="gaming-button">View Tournaments</Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {champions.map((champion) => (
              <motion.div key={champion.id} variants={item}>
                <Link to={`/champion/${champion.id}`} className="block">
                  <div className="gaming-card overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:shadow-gaming-orange/20">
                    <div className="relative h-64">
                      <img 
                        src={champion.heroImageURL} 
                        alt={champion.teamName} 
                        className="w-full h-full object-cover transform transition-all duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="text-gaming-orange" size={20} />
                          <h3 className="text-2xl font-bold text-white">{champion.teamName}</h3>
                        </div>
                        <p className="text-gray-200">
                          Captain: {champion.captainName}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-gaming-darker">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gaming-orange font-medium">{champion.tournamentName}</p>
                          <p className="text-sm text-gray-400">{new Date(champion.tournamentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="text-gray-400" size={16} />
                          <span className="text-gray-400 text-sm">{champion.players.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Champions;
