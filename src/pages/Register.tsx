
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import RegistrationWizard from '@/components/registration/RegistrationWizard';

const Register = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [tournamentExists, setTournamentExists] = useState(false);
  
  useEffect(() => {
    const checkTournament = async () => {
      if (!tournamentId) {
        toast({
          title: "Error",
          description: "No tournament specified. Please select a tournament first.",
          variant: "destructive"
        });
        navigate('/tournaments');
        return;
      }
      
      setIsLoading(true);
      try {
        const tournamentRef = doc(db, 'tournaments', tournamentId);
        const tournamentSnap = await getDoc(tournamentRef);
        
        if (tournamentSnap.exists()) {
          setTournamentExists(true);
        } else {
          toast({
            title: "Tournament Not Found",
            description: "The tournament you're trying to register for doesn't exist.",
            variant: "destructive"
          });
          navigate('/tournaments');
        }
      } catch (error) {
        console.error('Error checking tournament:', error);
        toast({
          title: "Error",
          description: "Failed to load tournament details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTournament();
  }, [tournamentId, navigate, toast]);

  return (
    <Layout>
      <Helmet>
        <title>Register Team | Free Fire Arena</title>
        <meta name="description" content="Register your team for Free Fire tournaments" />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">TOURNAMENT REGISTRATION</h1>
          <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gaming-orange"></div>
            </div>
          ) : tournamentExists ? (
            <RegistrationWizard tournamentId={tournamentId} />
          ) : (
            <div className="gaming-card p-6 text-center">
              <p className="text-white mb-4">Tournament not found or registration is closed.</p>
              <Button onClick={() => navigate('/tournaments')} className="gaming-button">
                Browse Tournaments
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Register;
