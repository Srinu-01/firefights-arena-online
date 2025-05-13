
import { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Clock } from 'lucide-react';
import type { RegistrationData } from './RegistrationWizard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ConfirmationStepProps {
  formData: RegistrationData;
  registrationSuccess: boolean;
  registrationId: string | null;
}

interface Tournament {
  tournamentName: string;
  startDateTime: string;
}

const ConfirmationStep = ({ 
  formData,
  registrationSuccess,
  registrationId
}: ConfirmationStepProps) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      if (!formData.tournamentId) return;
      
      try {
        const tournamentRef = doc(db, 'tournaments', formData.tournamentId);
        const tournamentSnap = await getDoc(tournamentRef);
        
        if (tournamentSnap.exists()) {
          setTournament(tournamentSnap.data() as Tournament);
        }
      } catch (error) {
        console.error('Error fetching tournament details:', error);
      }
    };
    
    fetchTournamentDetails();
  }, [formData.tournamentId]);
  
  useEffect(() => {
    if (!tournament?.startDateTime) return;
    
    const tournamentDate = new Date(tournament.startDateTime);
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = tournamentDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeRemaining('Tournament has started!');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    
    return () => clearInterval(interval);
  }, [tournament]);

  if (!registrationSuccess) {
    return (
      <div className="gaming-card p-6 text-center">
        <p className="text-white mb-4">Registration data is not available. Please complete the registration process.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <CheckCircle size={48} className="text-green-500 mr-2" />
        <h2 className="text-2xl font-bold text-white">Squad Registered Successfully!</h2>
      </div>

      {tournament && (
        <div className="bg-gaming-orange/10 border border-gaming-orange/30 rounded-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="text-gaming-orange mr-2" size={20} />
              <span className="text-white">Tournament starts in:</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-gaming-orange mr-2" size={20} />
              <span className="text-white font-bold">{timeRemaining}</span>
            </div>
          </div>
        </div>
      )}

      <div className="gaming-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Registration Details</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">ID:</span>
              <span className="text-white font-medium">{registrationId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Team Name:</span>
              <span className="text-white font-medium">{formData.teamName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Captain Contact:</span>
              <span className="text-white font-medium">{formData.captainContact}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Tournament:</span>
              <span className="text-white font-medium">{formData.tournamentName}</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-3">Players:</h4>
            <div className="space-y-2">
              {formData.players.map((player, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">
                    {index === 0 ? `Captain: ${player.ign}` : `Player ${index + 1}: ${player.ign}`}
                  </span>
                  <span className="text-white font-medium">UID: {player.uid}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Entry Fee:</span>
              <span className="text-white font-medium">₹{formData.entryFee}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Payment Status:</span>
              <span className="bg-yellow-500/20 text-yellow-500 px-3 py-0.5 rounded-full text-sm">
                Awaiting Verification
              </span>
            </div>
          </div>
          
          {formData.receiptUrl && (
            <div>
              <h4 className="font-medium text-white mb-3">Receipt:</h4>
              <div className="rounded-md overflow-hidden">
                <img 
                  src={formData.receiptUrl} 
                  alt="Payment receipt" 
                  className="w-full max-h-60 object-contain bg-white" 
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gaming-darker p-6 rounded-md border border-gaming-orange/20">
        <h3 className="font-bold text-white text-center mb-2">
          You're in! Prepare your squad, champions are made in practice. ⚔️🔥
        </h3>
        <p className="text-gray-300 text-center">
          Room details will be shared with the captain before the tournament starts.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationStep;
