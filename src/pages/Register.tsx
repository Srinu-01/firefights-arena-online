
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const registerFormSchema = z.object({
  teamName: z.string().min(3, { message: 'Team name must be at least 3 characters' }),
  captainName: z.string().min(3, { message: 'Captain name must be at least 3 characters' }),
  contactNumber: z.string().min(10, { message: 'Enter a valid contact number' }),
  player1IGN: z.string().min(3, { message: 'In-game name must be at least 3 characters' }),
  player2IGN: z.string().min(3, { message: 'In-game name must be at least 3 characters' }),
  player3IGN: z.string().min(3, { message: 'In-game name must be at least 3 characters' }),
  player4IGN: z.string().min(3, { message: 'In-game name must be at least 3 characters' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register = () => {
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      teamName: '',
      captainName: '',
      contactNumber: '',
      player1IGN: '',
      player2IGN: '',
      player3IGN: '',
      player4IGN: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsRegistering(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Register data:', data);
      setIsRegistering(false);
      toast({
        title: "Registration successful!",
        description: "Your team has been registered. You can now login to your account.",
      });
      form.reset();
    }, 1500);
  };

  return (
    <Layout>
      <Helmet>
        <title>Register Your Squad | Free Fire Arena</title>
        <meta name="description" content="Register your team for Free Fire tournaments." />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">REGISTER YOUR SQUAD</h1>
        <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
        
        <div className="gaming-card p-6 max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="captainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Captain Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter captain name" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Squad Members</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="player1IGN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Player 1 IGN</FormLabel>
                        <FormControl>
                          <Input placeholder="In-game name" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="player2IGN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Player 2 IGN</FormLabel>
                        <FormControl>
                          <Input placeholder="In-game name" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="player3IGN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Player 3 IGN</FormLabel>
                        <FormControl>
                          <Input placeholder="In-game name" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="player4IGN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Player 4 IGN</FormLabel>
                        <FormControl>
                          <Input placeholder="In-game name" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" className="bg-gaming-dark border-gaming-orange/50 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="gaming-button w-full text-lg py-6" 
                  disabled={isRegistering}
                >
                  {isRegistering ? "Registering..." : "Register Squad"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
