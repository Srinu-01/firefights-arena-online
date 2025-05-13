
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trophy, ChevronLeft, Users } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const ChampionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [champion, setChampion] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      fetchChampionDetails(id);
    }
  }, [id]);

  const fetchChampionDetails = async (championId: string) => {
    setLoading(true);
    try {
      const championDoc = doc(db, 'champions', championId);
      const championSnapshot = await getDoc(championDoc);
      
      if (championSnapshot.exists()) {
        setChampion({
          id: championSnapshot.id,
          ...championSnapshot.data()
        } as Champion);
      } else {
        console.log('No such champion!');
        navigate('/champions');
      }
    } catch (error) {
      console.error("Error fetching champion details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center text-white">
          Loading champion details...
        </div>
      </Layout>
    );
  }

  if (!champion) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center text-white">
          Champion not found!
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{`${champion.teamName} | Champions | Free Fire Arena`}</title>
        <meta name="description" content={`${champion.teamName} - Free Fire tournament champion`} />
      </Helmet>

      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-gaming-orange/30 hover:bg-gaming-orange/20"
            onClick={() => navigate('/champions')}
          >
            <ChevronLeft size={16} />
            <span>Back to Champions</span>
          </Button>
        </div>
        
        {/* Hero Section */}
        <div className="relative mb-8">
          <AspectRatio ratio={21 / 9} className="rounded-lg overflow-hidden">
            <img
              src={champion.heroImageURL || "https://wallpapercave.com/wp/wp11213059.jpg"}
              alt={champion.teamName}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="text-gaming-orange" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold text-white">{champion.teamName}</h1>
            </div>
            <p className="text-xl text-gray-200">
              {champion.tournamentName} Champion
            </p>
          </div>
        </div>
        
        {/* Tabs Section */}
        <Tabs defaultValue="team" className="gaming-card">
          <TabsList className="grid w-full grid-cols-3 bg-gaming-gray">
            <TabsTrigger value="team">Team Info</TabsTrigger>
            <TabsTrigger value="proof">Championship Proof</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          {/* Team Info Tab */}
          <TabsContent value="team" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Users className="text-gaming-orange" size={24} />
                <h2 className="text-2xl font-bold text-white">Team Roster</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {champion.players.map((player, index) => (
                  <div key={index} className="gaming-card p-4 border-l-4 border-gaming-orange">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold text-white">
                          {index === 0 ? `${player.name} (Captain)` : player.name}
                        </p>
                        <p className="text-sm text-gray-300">UID: {player.freeFireUID}</p>
                      </div>
                      <div className="bg-gaming-orange/20 h-8 w-8 flex items-center justify-center rounded-full">
                        <span className="text-gaming-orange font-bold">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Championship Proof Tab */}
          <TabsContent value="proof" className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Championship Proof</h2>
              <div className="gaming-card p-2">
                <img
                  src={champion.proofImageURL}
                  alt="Championship proof"
                  className="w-full rounded-md"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Gallery Tab */}
          <TabsContent value="gallery" className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Gallery</h2>
              {champion.galleryMediaURLs.length === 0 ? (
                <p className="text-gray-400">No gallery items available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {champion.galleryMediaURLs.map((url, index) => (
                    <div key={index} className="gaming-card p-2 overflow-hidden">
                      <img
                        src={url}
                        alt={`Gallery item ${index + 1}`}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ChampionDetail;
