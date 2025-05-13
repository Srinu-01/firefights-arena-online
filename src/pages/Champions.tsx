
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trophy, ChevronRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
  galleryMediaURLs: string[];
}

const Champions = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    setLoading(true);
    try {
      const championsCollection = collection(db, 'champions');
      const championsSnapshot = await getDocs(championsCollection);
      const championsList = championsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Champion[];
      setChampions(championsList);
    } catch (error) {
      console.error("Error fetching champions:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewChampionDetails = (championId: string) => {
    navigate(`/champion/${championId}`);
  };

  return (
    <Layout>
      <Helmet>
        <title>Champions | Free Fire Arena</title>
        <meta name="description" content="Free Fire tournament champions hall of fame" />
      </Helmet>

      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-gaming-orange" size={28} />
          <h1 className="text-3xl md:text-4xl font-bold text-white">CHAMPIONS</h1>
        </div>
        <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
        
        {loading ? (
          <div className="py-10 text-center text-white">Loading champions...</div>
        ) : champions.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-lg">No champions yet.</p>
            <p className="text-gray-400 mt-2">
              Join a tournament and fight your way to victory!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {champions.map((champion) => (
              <div
                key={champion.id}
                className="gaming-card cursor-pointer overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-lg"
                onClick={() => viewChampionDetails(champion.id)}
              >
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={champion.heroImageURL || "https://wallpapercave.com/wp/wp11213059.jpg"}
                      alt={champion.teamName}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Trophy className="text-gaming-orange" size={18} />
                          <span className="font-bold text-white text-lg">{champion.teamName}</span>
                        </div>
                        <p className="text-gray-200">Captain: {champion.captainName}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-gaming-orange/20 border-gaming-orange hover:bg-gaming-orange/40"
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-300">{champion.tournamentName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Champions;
