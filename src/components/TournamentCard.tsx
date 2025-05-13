
import { Calendar, Users, Clock, DollarSign, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface TournamentProps {
  id: string;
  title: string;
  mode: string;
  entryFee: number;
  prizePool: number;
  dateTime: string;
  status: 'upcoming' | 'live' | 'completed';
  maxSlots: number;
  bannerUrl: string;
  
  // Optional fields for leaderboard entries
  rank?: number;
  teamName?: string;
  playerName?: string;
  kills?: number;
  matches?: number;
  wins?: number;
  points?: number;
}

const TournamentCard = ({
  id,
  title,
  mode,
  entryFee,
  prizePool,
  dateTime,
  status,
  maxSlots,
  bannerUrl
}: TournamentProps) => {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-500';
      case 'live':
        return 'bg-green-500 animate-pulse';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div 
      className="gaming-card overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:shadow-gaming-orange/20"
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 } 
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={bannerUrl} 
          alt={title} 
          className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-gaming-dark/80 to-transparent"></div>
        <div className="absolute top-4 right-4">
          <span className={`${getStatusColor()} text-white text-xs font-bold uppercase px-3 py-1 rounded-full`}>
            {status}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md line-clamp-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <Users size={14} className="text-gaming-orange" />
            <span className="drop-shadow-md">{mode}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-4 flex flex-wrap gap-3 justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar size={14} className="text-gaming-orange" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock size={14} className="text-gaming-orange" />
            <span>{formattedTime}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4 bg-gaming-darker/70 p-3 rounded-lg">
          <div className="flex items-center gap-1">
            <Trophy size={18} className="text-gaming-orange" />
            <div className="flex flex-col">
              <span className="font-bold text-white">₹{prizePool}</span>
              <span className="text-gray-400 text-xs">Prize Pool</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-xs block">Entry Fee</span>
            <span className="font-bold text-white">₹{entryFee}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/tournament/${id}`} className="flex-1">
            <Button className="gaming-button w-full bg-gaming-darker hover:bg-gaming-dark border border-gaming-orange/50">View Details</Button>
          </Link>
          <Link to={`/register/${id}`} className="flex-1">
            <Button className="gaming-button-secondary w-full">Register</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TournamentCard;
