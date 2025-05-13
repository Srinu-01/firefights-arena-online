
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface PlayerInputFieldProps {
  form: UseFormReturn<any>;
  index: number;
  isTeamCaptain?: boolean;
}

const PlayerInputField = ({ form, index, isTeamCaptain = false }: PlayerInputFieldProps) => {
  const playerNumber = index + 1;
  const ignFieldName = `player${playerNumber}IGN` as const;
  const uidFieldName = `player${playerNumber}UID` as const;

  return (
    <div className={`gaming-card p-4 ${isTeamCaptain ? 'border-l-4 border-gaming-orange' : ''}`}>
      <h3 className="font-bold text-white mb-3">
        Player {playerNumber} {isTeamCaptain ? '(Captain)' : ''}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={ignFieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">In-Game Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder={`Enter ${isTeamCaptain ? 'captain' : 'player'} IGN`} 
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
          name={uidFieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Free Fire UID</FormLabel>
              <FormControl>
                <Input 
                  placeholder={`Enter ${isTeamCaptain ? 'captain' : 'player'} UID`} 
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
  );
};

export default PlayerInputField;
