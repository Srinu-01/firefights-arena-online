
import { Calendar, Users, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    <div className="gaming-card animate-slide-in">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={bannerUrl} 
          alt={title} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark to-transparent"></div>
        <div className="absolute top-4 right-4">
          <span className={`${getStatusColor()} text-white text-xs font-bold uppercase px-3 py-1 rounded-full`}>
            {status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar size={16} className="text-gaming-orange" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock size={16} className="text-gaming-orange" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users size={16} className="text-gaming-orange" />
            <span>{mode}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <DollarSign size={18} className="text-gaming-orange" />
            <span className="font-bold text-white">${prizePool}</span>
            <span className="text-gray-400 text-sm">Prize Pool</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-sm">Entry Fee</span>
            <span className="ml-1 font-bold text-white">${entryFee}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/tournament/${id}`} className="flex-1">
            <Button className="gaming-button w-full">View Details</Button>
          </Link>
          <Link to={`/register/${id}`} className="flex-1">
            <Button className="gaming-button-secondary w-full">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
