
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import TournamentCard, { TournamentProps } from '@/components/TournamentCard';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const TournamentsList = () => {
  const [tournaments, setTournaments] = useState<TournamentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const tournamentsCollection = collection(db, 'tournaments');
        const tournamentSnapshot = await getDocs(tournamentsCollection);
        const tournamentList = tournamentSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || data.tournamentName || 'Unnamed Tournament',
            mode: data.mode || data.tournamentType || 'Squad (4v4)',
            entryFee: data.entryFee || 0,
            prizePool: data.prizePool || 0,
            dateTime: data.dateTime || data.startDateTime || new Date().toISOString(),
            status: data.status || 'upcoming',
            maxSlots: data.maxSlots || data.maxTeams || 25,
            bannerUrl: data.bannerUrl || data.imageUrl || 'https://wallpapercave.com/wp/wp11213059.jpg'
          } as TournamentProps;
        });
        
        // Sort tournaments by date (newest first)
        tournamentList.sort((a, b) => {
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        });
        
        setTournaments(tournamentList);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        toast({
          title: "Error",
          description: "Failed to load tournaments. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [toast]);

  return (
    <Layout>
      <Helmet>
        <title>Tournaments | Free Fire Arena</title>
        <meta name="description" content="Browse and register for upcoming Free Fire tournaments." />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">UPCOMING TOURNAMENTS</h1>
        <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-orange"></div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-xl">No upcoming tournaments available.</p>
            <p className="text-gray-400 mt-2">Please check back later for new tournaments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} {...tournament} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TournamentsList;
