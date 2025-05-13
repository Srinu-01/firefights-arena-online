
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { RegistrationData } from './RegistrationWizard';

interface PlayersStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const uidRegex = /^\d{5,12}$/; // 5-12 digits

const playerSchema = z.object({
  player1IGN: z.string().min(3, { message: 'IGN must be at least 3 characters' }),
  player1UID: z.string().regex(uidRegex, { message: 'UID must be 5-12 digits' }),
  player2IGN: z.string().min(3, { message: 'IGN must be at least 3 characters' }),
  player2UID: z.string().regex(uidRegex, { message: 'UID must be 5-12 digits' }),
  player3IGN: z.string().min(3, { message: 'IGN must be at least 3 characters' }),
  player3UID: z.string().regex(uidRegex, { message: 'UID must be 5-12 digits' }),
  player4IGN: z.string().min(3, { message: 'IGN must be at least 3 characters' }),
  player4UID: z.string().regex(uidRegex, { message: 'UID must be 5-12 digits' }),
});

const PlayersStep = ({ formData, updateFormData, nextStep, prevStep }: PlayersStepProps) => {
  const form = useForm<z.infer<typeof playerSchema>>({
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

  const onSubmit = (data: z.infer<typeof playerSchema>) => {
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
            <div className="gaming-card p-4 border-l-4 border-gaming-orange">
              <h3 className="font-bold text-white mb-3">Player 1 (Captain)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="player1IGN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">In-Game Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter captain IGN" 
                          className="bg-gaming-dark border-gaming-orange/50 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player1UID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Free Fire UID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter captain UID" 
                          className="bg-gaming-dark border-gaming-orange/50 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Player 2 */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-white mb-3">Player 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="player2IGN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">In-Game Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter player IGN" 
                          className="bg-gaming-dark border-gaming-orange/50 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player2UID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Free Fire UID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter player UID" 
                          className="bg-gaming-dark border-gaming-orange/50 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Player 3 */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-white mb-3">Player 3</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="player3IGN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">In-Game Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter player IGN" 
                          className="bg-gaming-dark border-gaming-orange/50 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player3UID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Free Fire UID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter player UID" 
                          className="bg-gaming-dark border-gaming-orange/50 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Player 4 */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-white mb-3">Player 4</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="player4IGN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">In-Game Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter player IGN" 
                          className="bg-gaming-dark border-gaming-orange/50 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player4UID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Free Fire UID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter player UID" 
                          className="bg-gaming-dark border-gaming-orange/50 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
