
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { RegistrationData } from './RegistrationWizard';

interface ConfirmationStepProps {
  formData: RegistrationData;
  handleSubmit: () => void;
}

const ConfirmationStep = ({ formData }: ConfirmationStepProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Squad Registered Successfully!</h2>
        <p className="text-sm text-gray-300">Your registration is complete and is awaiting admin verification</p>
      </div>

      <Card className="border-0 bg-gaming-gray/50">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Team Name:</span>
                <span className="text-white font-medium">{formData.teamName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Captain Contact:</span>
                <span className="text-white font-medium">{formData.captainContact}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Players</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Captain:</span>
                  <span className="text-white font-medium">
                    {formData.players[0].ign} — {formData.players[0].uid}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Player 2:</span>
                  <span className="text-white font-medium">
                    {formData.players[1].ign} — {formData.players[1].uid}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Player 3:</span>
                  <span className="text-white font-medium">
                    {formData.players[2].ign} — {formData.players[2].uid}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Player 4:</span>
                  <span className="text-white font-medium">
                    {formData.players[3].ign} — {formData.players[3].uid}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Entry Fee:</span>
                <span className="text-white font-bold">₹200</span>
              </div>
              
              {formData.receiptUrl && (
                <div className="space-y-1">
                  <span className="text-gray-300">Receipt:</span>
                  <div className="overflow-hidden rounded-md">
                    {/* This would be an actual image in a real app */}
                    <div className="bg-gaming-darker p-4 text-center text-sm text-gray-400">
                      Receipt Image Preview
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gaming-darker p-3 rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                <span className="text-white font-medium">Status: Awaiting Admin Payment Verification</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Room details will be sent to your WhatsApp number once payment is verified
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-4 pt-4">
        <Button 
          className="gaming-button"
          onClick={() => navigate('/tournaments')}
        >
          View All Tournaments
        </Button>
        
        <Button 
          variant="outline"
          className="border-gaming-orange/50 text-white hover:bg-gaming-orange/20"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
