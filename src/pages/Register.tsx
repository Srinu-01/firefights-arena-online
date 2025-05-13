
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const tournamentFormats = {
  'Solo': 1,
  'Duo': 2,
  'Squad': 4
};

// Define the schema for stage 1: Team Info
const teamInfoSchema = z.object({
  teamName: z.string().min(3, { message: 'Team name must be at least 3 characters' }),
  captainWhatsapp: z.string().min(10, { message: 'Please enter a valid WhatsApp number' }),
  captainEmail: z.string().email({ message: 'Please enter a valid email' })
});

type TeamInfoFormValues = z.infer<typeof teamInfoSchema>;

// Define the schema for stage 2: Player Details (will be dynamic based on team size)
const playerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  ign: z.string().min(3, { message: 'In-game name must be at least 3 characters' }),
  uid: z.string().min(5, { message: 'UID must be at least 5 characters' })
});

// We'll create this schema dynamically based on the tournament format

interface TournamentData {
  id: string;
  title: string;
  tournamentFormat: 'Solo' | 'Duo' | 'Squad';
  entryFee: number;
  status: 'upcoming' | 'live' | 'completed';
}

const Register = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for the registration process
  const [currentStage, setCurrentStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tournament, setTournament] = useState<TournamentData | null>(null);
  const [teamData, setTeamData] = useState({
    teamName: '',
    captainWhatsapp: '',
    captainEmail: '',
    players: [] as any[]
  });
  
  // Forms 
  const teamInfoForm = useForm<TeamInfoFormValues>({
    resolver: zodResolver(teamInfoSchema),
    defaultValues: {
      teamName: '',
      captainWhatsapp: '',
      captainEmail: ''
    }
  });
  
  // Fetch tournament details
  useEffect(() => {
    const fetchTournament = async () => {
      if (!tournamentId) {
        toast({
          title: "Error",
          description: "No tournament specified",
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
          const data = tournamentSnap.data() as TournamentData;
          setTournament({
            id: tournamentSnap.id,
            ...data
          });
        } else {
          // If not found in Firebase, use a sample tournament (for development)
          setTournament({
            id: 'sample_tournament',
            title: 'Sample Tournament',
            tournamentFormat: 'Squad',
            entryFee: 100,
            status: 'upcoming'
          });
          
          console.log('Using sample tournament data as tournament not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching tournament:', error);
        toast({
          title: "Error",
          description: "Failed to load tournament details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTournament();
  }, [tournamentId, navigate, toast]);
  
  // Handle Form Submissions
  const handleTeamInfoSubmit = (values: TeamInfoFormValues) => {
    setTeamData(prev => ({
      ...prev,
      teamName: values.teamName,
      captainWhatsapp: values.captainWhatsapp,
      captainEmail: values.captainEmail
    }));
    
    // Create a player profile in Firebase for the captain
    const createCaptainProfile = async () => {
      try {
        const playerProfile = {
          name: '',  // To be filled in the next stage
          phone: values.captainWhatsapp,
          email: values.captainEmail,
          ign: '',   // To be filled in the next stage
          uid: '',   // To be filled in the next stage
          isLocked: true,  // Captain profile is locked after registration
          createdAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, 'players'), playerProfile);
        
        toast({
          title: "Captain profile created",
          description: "Your profile has been registered as team captain"
        });
      } catch (error) {
        console.error('Error creating captain profile:', error);
        // We'll continue even if this fails
      }
    };
    
    createCaptainProfile();
    
    // Move to the next stage
    setCurrentStage(1);
  };
  
  // Dynamically render the form based on current stage
  const renderStageForm = () => {
    switch (currentStage) {
      case 0:
        return (
          <Form {...teamInfoForm}>
            <form onSubmit={teamInfoForm.handleSubmit(handleTeamInfoSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Team Information</h2>
                <p className="text-sm text-gray-300">Enter your team details to begin registration</p>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={teamInfoForm.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter team name" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={teamInfoForm.control}
                  name="captainWhatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Captain WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter WhatsApp number" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                      </FormControl>
                      <p className="text-xs text-gray-400">This will be used for updates and as your login ID</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={teamInfoForm.control}
                  name="captainEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Captain Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                      </FormControl>
                      <p className="text-xs text-gray-400">This will be used to create your player profile</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="gaming-button w-full text-lg py-6" 
                  disabled={isLoading}
                >
                  Continue to Player Details
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case 1:
        // Stage 2 will be implemented later, for now just show placeholder
        return <div>Player Details Form (Stage 2)</div>;
        
      case 2:
        // Stage 3 will be implemented later, for now just show placeholder  
        return <div>Payment Form (Stage 3)</div>;
        
      default:
        return <div>Unknown stage</div>;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Register Squad | Free Fire Arena</title>
        <meta name="description" content="Register your team for Free Fire tournaments" />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tournament?.title || 'Tournament'} Registration</h1>
          <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className={`flex-1 text-center ${currentStage >= 0 ? 'text-gaming-orange' : 'text-gray-500'}`}>
                <div className={`rounded-full w-10 h-10 mb-2 mx-auto flex items-center justify-center ${currentStage >= 0 ? 'bg-gaming-orange' : 'bg-gray-700'}`}>
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-sm">Team Info</p>
              </div>
              <div className="w-full h-1 mx-2 bg-gray-700">
                <div className={`h-1 bg-gaming-orange ${currentStage >= 1 ? 'w-full' : 'w-0'} transition-all duration-300`}></div>
              </div>
              <div className={`flex-1 text-center ${currentStage >= 1 ? 'text-gaming-orange' : 'text-gray-500'}`}>
                <div className={`rounded-full w-10 h-10 mb-2 mx-auto flex items-center justify-center ${currentStage >= 1 ? 'bg-gaming-orange' : 'bg-gray-700'}`}>
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-sm">Player Details</p>
              </div>
              <div className="w-full h-1 mx-2 bg-gray-700">
                <div className={`h-1 bg-gaming-orange ${currentStage >= 2 ? 'w-full' : 'w-0'} transition-all duration-300`}></div>
              </div>
              <div className={`flex-1 text-center ${currentStage >= 2 ? 'text-gaming-orange' : 'text-gray-500'}`}>
                <div className={`rounded-full w-10 h-10 mb-2 mx-auto flex items-center justify-center ${currentStage >= 2 ? 'bg-gaming-orange' : 'bg-gray-700'}`}>
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-sm">Payment</p>
              </div>
            </div>
          </div>
          
          <div className="gaming-card p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gaming-orange"></div>
              </div>
            ) : (
              renderStageForm()
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
