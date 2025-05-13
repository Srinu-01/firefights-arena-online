
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import TeamInfoStep from './TeamInfoStep';
import PlayersStep from './PlayersStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import StepIndicator from './StepIndicator';
import { motion } from 'framer-motion';

export interface PlayerData {
  ign: string;
  uid: string;
}

export interface RegistrationData {
  teamName: string;
  captainContact: string;
  players: PlayerData[];
  paymentStatus: 'pending' | 'verified' | 'rejected';
  receiptUrl: string | null;
  tournamentId: string;
  slot: number | null;
  roomCredsSent: boolean;
  kills: number;
  resultRank: number | null;
  prizeAmount: number;
  payoutStatus: 'pending' | 'completed';
}

interface RegistrationWizardProps {
  tournamentId: string;
}

const RegistrationWizard = ({ tournamentId }: RegistrationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>({
    teamName: '',
    captainContact: '',
    players: [
      { ign: '', uid: '' },
      { ign: '', uid: '' },
      { ign: '', uid: '' },
      { ign: '', uid: '' }
    ],
    paymentStatus: 'pending',
    receiptUrl: null,
    tournamentId,
    slot: null,
    roomCredsSent: false,
    kills: 0,
    resultRank: null,
    prizeAmount: 0,
    payoutStatus: 'pending'
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { name: 'Team Info', component: TeamInfoStep },
    { name: 'Players', component: PlayersStep },
    { name: 'Payment', component: PaymentStep },
    { name: 'Confirmation', component: ConfirmationStep }
  ];

  const updateFormData = (data: Partial<RegistrationData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmitRegistration = async () => {
    try {
      // This would be where we'd submit the data to Firebase
      console.log('Submitting registration:', formData);
      toast({
        title: "Registration Complete!",
        description: "Your squad has been registered successfully.",
      });
      // In a real app, we'd wait for the submission to complete
      // then navigate to confirmation or dashboard
      // navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      <StepIndicator steps={steps.map(s => s.name)} currentStep={currentStep} />
      
      <motion.div
        key={currentStep}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <StepComponent 
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          handleSubmit={handleSubmitRegistration}
        />
      </motion.div>
    </div>
  );
};

export default RegistrationWizard;
