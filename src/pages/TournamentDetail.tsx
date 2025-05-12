
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Calendar, Clock, Users, DollarSign, MapPin, Trophy, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TournamentDetailProps {
  id: string;
  title: string;
  description: string;
  mode: string;
  entryFee: number;
  prizePool: number;
  dateTime: string;
  status: 'upcoming' | 'live' | 'completed';
  maxSlots: number;
  bannerUrl: string;
  registeredTeams: number;
  mapRotation: string[];
  prizeBreakdown: {
    position: string;
    prize: number;
  }[];
  rules: string[];
}

// Sample tournament data
const tournaments: Record<string, TournamentDetailProps> = {
  'tourney_001': {
    id: 'tourney_001',
    title: 'Daily Custom #27',
    description: 'Join our daily custom tournament featuring 25 top squads battling for glory. Room ID and password will be shared 15 minutes before the match starts. All players must be registered and verified.',
    mode: 'Squad (4v4)',
    entryFee: 30,
    prizePool: 500,
    dateTime: '2025-06-01T19:00:00Z',
    status: 'upcoming',
    maxSlots: 25,
    registeredTeams: 18,
    bannerUrl: 'https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/202210/ce405ad07404fecfb3196b77822aec8b.jpg',
    mapRotation: ['Bermuda', 'Kalahari', 'Purgatory'],
    prizeBreakdown: [
      { position: '1st Place', prize: 250 },
      { position: '2nd Place', prize: 150 },
      { position: '3rd Place', prize: 100 },
    ],
    rules: [
      'All team members must be registered 30 minutes before the match',
      'Teams must join the room 15 minutes before start time',
      'Teaming with other squads is strictly prohibited',
      'Screenshots of final results must be submitted for verification',
      'Admin decisions are final and non-negotiable'
    ]
  },
  'tourney_002': {
    id: 'tourney_002',
    title: 'Weekend Showdown #12',
    description: 'The biggest weekend tournament with massive prize pool. This is an invite-only tournament featuring the top teams from our daily customs. Prepare for intense competition and glory!',
    mode: 'Squad (4v4)',
    entryFee: 50,
    prizePool: 1000,
    dateTime: '2025-06-05T20:00:00Z',
    status: 'upcoming',
    maxSlots: 25,
    registeredTeams: 12,
    bannerUrl: 'https://freefiremobile-a.akamaihd.net/common/web_event/official2.ff.garena.all/img/20228/2bc8496f63451357a571fbfa6c96f541.jpg',
    mapRotation: ['Bermuda', 'Kalahari', 'Purgatory', 'Bermuda'],
    prizeBreakdown: [
      { position: '1st Place', prize: 500 },
      { position: '2nd Place', prize: 300 },
      { position: '3rd Place', prize: 200 },
    ],
    rules: [
      'All team members must be registered 30 minutes before the match',
      'Teams must join the room 15 minutes before start time',
      'Teaming with other squads is strictly prohibited',
      'Screenshots of final results must be submitted for verification',
      'Admin decisions are final and non-negotiable'
    ]
  },
  'tourney_003': {
    id: 'tourney_003',
    title: 'Elite Tournament',
    description: 'A special duo tournament format for those who prefer intense 2-player coordination. Limited slots available - register fast to secure your spot!',
    mode: 'Duo (2v2)',
    entryFee: 25,
    prizePool: 300,
    dateTime: '2025-06-03T18:30:00Z',
    status: 'upcoming',
    maxSlots: 50,
    registeredTeams: 32,
    bannerUrl: 'https://freefiremobile-a.akamaihd.net/common/web_event/official2.ff.garena.all/img/20228/273ccca592700669c1532bd04f6f257a.jpg',
    mapRotation: ['Bermuda', 'Kalahari', 'Bermuda'],
    prizeBreakdown: [
      { position: '1st Place', prize: 150 },
      { position: '2nd Place', prize: 100 },
      { position: '3rd Place', prize: 50 },
    ],
    rules: [
      'All team members must be registered 30 minutes before the match',
      'Teams must join the room 15 minutes before start time',
      'Teaming with other duos is strictly prohibited',
      'Screenshots of final results must be submitted for verification',
      'Admin decisions are final and non-negotiable'
    ]
  },
  'tourney_004': {
    id: 'tourney_004',
    title: 'Pro League Season 5',
    description: 'Our premier professional tournament featuring the best of the best. This is a multi-day event with extensive coverage and the highest prize pool of the season.',
    mode: 'Squad (4v4)',
    entryFee: 100,
    prizePool: 2500,
    dateTime: '2025-06-10T21:00:00Z',
    status: 'upcoming',
    maxSlots: 25,
    registeredTeams: 8,
    bannerUrl: 'https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/202210/768671f1dc8d3c0a8f2448cf5ed6739c.jpg',
    mapRotation: ['Bermuda', 'Kalahari', 'Purgatory', 'Bermuda', 'Purgatory'],
    prizeBreakdown: [
      { position: '1st Place', prize: 1200 },
      { position: '2nd Place', prize: 800 },
      { position: '3rd Place', prize: 500 },
    ],
    rules: [
      'All team members must be registered 1 hour before the match',
      'Teams must join the room 30 minutes before start time',
      'Teaming with other squads is strictly prohibited',
      'Live streaming is mandatory for all participating teams',
      'Screenshots of final results must be submitted for verification',
      'Admin decisions are final and non-negotiable'
    ]
  }
};

const TournamentDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const tournament = tournaments[id];
  
  if (!tournament) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-white mb-6">Tournament Not Found</h1>
          <Link to="/tournaments">
            <Button className="gaming-button">View All Tournaments</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const formattedDate = new Date(tournament.dateTime).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = new Date(tournament.dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const handleRegisterClick = () => {
    toast({
      title: "Registration initiated",
      description: `You're being redirected to register for ${tournament.title}`,
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>{tournament.title} | Free Fire Arena</title>
        <meta name="description" content={tournament.description} />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-8">
          <img 
            src={tournament.bannerUrl} 
            alt={tournament.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{tournament.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`
                ${tournament.status === 'upcoming' ? 'bg-yellow-500' : 
                  tournament.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'} 
                text-white text-xs font-bold uppercase px-3 py-1 rounded-full
              `}>
                {tournament.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="gaming-card p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Tournament Details</h2>
              <p className="text-gray-300 mb-6">{tournament.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="text-gaming-orange h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-gaming-orange h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="text-white">{formattedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-gaming-orange h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-400">Mode</p>
                    <p className="text-white">{tournament.mode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-gaming-orange h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-400">Maps</p>
                    <p className="text-white">{tournament.mapRotation.join(' → ')}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">Rules</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                {tournament.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
            
            <div className="gaming-card p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                <Trophy className="text-gaming-orange h-6 w-6" />
                Prize Breakdown
              </h2>
              <div className="space-y-4">
                {tournament.prizeBreakdown.map((prize, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                        index === 1 ? 'bg-gray-400/20 text-gray-400' : 
                        'bg-amber-700/20 text-amber-700'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{prize.position}</span>
                    </div>
                    <span className="text-gaming-orange font-bold">${prize.prize}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="gaming-card p-6 mb-8 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Entry Fee</p>
                  <p className="text-white text-2xl font-bold">${tournament.entryFee}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Prize Pool</p>
                  <p className="text-gaming-orange text-2xl font-bold">${tournament.prizePool}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Slots</span>
                  <span className="text-white">{tournament.registeredTeams}/{tournament.maxSlots}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div 
                    className="bg-gaming-orange h-2.5 rounded-full" 
                    style={{ width: `${(tournament.registeredTeams / tournament.maxSlots) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <Link to={`/register/${tournament.id}`}>
                <Button 
                  className="gaming-button w-full text-lg py-6 mb-4"
                  onClick={handleRegisterClick}
                >
                  Register Now
                </Button>
              </Link>
              
              <div className="flex items-center justify-center text-gray-400 gap-1 text-sm">
                <Shield size={14} />
                <span>Secure payment & instant registration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TournamentDetail;
