
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TournamentCard, { TournamentProps } from './TournamentCard';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

const UpcomingTournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUpcomingTournaments = async () => {
      setLoading(true);
      try {
        // Get today and tomorrow dates (for filtering)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        
        // Fetch tournaments from Firestore
        const tournamentsCollection = collection(db, 'tournaments');
        const tournamentSnapshot = await getDocs(tournamentsCollection);
        
        // Parse the documents and filter for tomorrow's tournaments
        const allTournaments = tournamentSnapshot.docs.map(doc => {
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
        
        // Filter for tournaments happening tomorrow
        const tomorrowTournaments = allTournaments.filter(tournament => {
          const tournamentDate = new Date(tournament.dateTime);
          return tournamentDate >= tomorrow && tournamentDate < dayAfterTomorrow;
        });
        
        // Sort by time
        tomorrowTournaments.sort((a, b) => {
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        });
        
        // Take only first 4 tournaments
        setTournaments(tomorrowTournaments.slice(0, 4));
      } catch (error) {
        console.error('Error fetching upcoming tournaments:', error);
        toast({
          title: "Error",
          description: "Failed to load upcoming tournaments.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUpcomingTournaments();
  }, [toast]);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="py-16 px-4 md:px-8 bg-gaming-darker/60 backdrop-blur-sm">
        <div className="container mx-auto flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-orange"></div>
        </div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return null; // Don't show the section if there are no tournaments for tomorrow
  }

  return (
    <div className="py-16 px-4 md:px-8 bg-gaming-darker/60 backdrop-blur-sm">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 relative inline-block">
            UPCOMING TOURNAMENTS
            <div className="h-1 bg-gradient-to-r from-gaming-orange/20 via-gaming-orange to-gaming-orange/20 w-full absolute bottom-0"></div>
          </h2>
          <p className="text-gray-300 mt-3 max-w-xl mx-auto">
            Join our exciting tournaments and compete for glory and amazing prizes
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {tournaments.map((tournament) => (
            <motion.div key={tournament.id} variants={item}>
              <TournamentCard {...tournament} />
            </motion.div>
          ))}
        </motion.div>
        
        {tournaments.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link to="/tournaments">
              <Button className="gaming-button">
                View All Tournaments
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingTournaments;
