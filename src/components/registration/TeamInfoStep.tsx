
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { RegistrationData } from './RegistrationWizard';

interface TeamInfoStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format

const teamInfoSchema = z.object({
  teamName: z.string().min(3, { message: 'Team name must be at least 3 characters' }),
  captainContact: z.string().regex(phoneRegex, { message: 'Please enter a valid 10-digit Indian mobile number' }),
});

const TeamInfoStep = ({ formData, updateFormData, nextStep }: TeamInfoStepProps) => {
  const form = useForm<z.infer<typeof teamInfoSchema>>({
    resolver: zodResolver(teamInfoSchema),
    defaultValues: {
      teamName: formData.teamName,
      captainContact: formData.captainContact,
    },
  });

  const onSubmit = (data: z.infer<typeof teamInfoSchema>) => {
    updateFormData({
      teamName: data.teamName,
      captainContact: data.captainContact,
    });
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Team Information</h2>
            <p className="text-sm text-gray-300">Enter your team details below</p>
          </div>

          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Team Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your team name" 
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
            name="captainContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Captain Contact Number (WhatsApp)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter 10-digit number" 
                    className="bg-gaming-dark border-gaming-orange/50 text-white" 
                    {...field} 
                  />
                </FormControl>
                <p className="text-xs text-gray-400 mt-1">Will be used for match updates & room info</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="gaming-button"
          >
            Continue to Player Details
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamInfoStep;
