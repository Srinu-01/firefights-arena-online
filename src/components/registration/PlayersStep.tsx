
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { RegistrationData } from './RegistrationWizard';
import { playerSchema, type PlayerFormValues } from './playerValidationSchema';
import PlayerInputField from './PlayerInputField';

interface PlayersStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const PlayersStep = ({ formData, updateFormData, nextStep, prevStep }: PlayersStepProps) => {
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      player1IGN: formData.players[0].ign,
      player1UID: formData.players[0].uid,
      player2IGN: formData.players[1].ign,
      player2UID: formData.players[1].uid,
      player3IGN: formData.players[2].ign,
      player3UID: formData.players[2].uid,
      player4IGN: formData.players[3].ign,
      player4UID: formData.players[3].uid,
    },
  });

  const onSubmit = (data: PlayerFormValues) => {
    updateFormData({
      players: [
        { ign: data.player1IGN, uid: data.player1UID },
        { ign: data.player2IGN, uid: data.player2UID },
        { ign: data.player3IGN, uid: data.player3UID },
        { ign: data.player4IGN, uid: data.player4UID },
      ]
    });
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Squad Details</h2>
            <p className="text-sm text-gray-300">Enter details for all 4 team members</p>
          </div>

          <div className="space-y-6">
            {/* Player 1 (Captain) */}
            <PlayerInputField form={form} index={0} isTeamCaptain={true} />
            
            {/* Players 2-4 */}
            {[1, 2, 3].map((index) => (
              <PlayerInputField key={index} form={form} index={index} />
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            className="border-gaming-orange/50 text-white hover:bg-gaming-orange/20"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="gaming-button"
          >
            Continue to Payment
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PlayersStep;
