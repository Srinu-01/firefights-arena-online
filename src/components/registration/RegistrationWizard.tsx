
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { doc, addDoc, collection, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { generateUpiLink } from '@/lib/helpers';
import TeamInfoStep from './TeamInfoStep';
import PlayersStep from './PlayersStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import StepIndicator from './StepIndicator';
import { motion } from 'framer-motion';

export interface PlayerData {
  ign: string;
  uid: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface RegistrationData {
  teamName: string;
  captainContact: string;
  captainEmail: string;
  players: PlayerData[];
  paymentStatus: 'pending' | 'verified' | 'rejected';
  receiptUrl: string | null;
  tournamentId: string;
  tournamentName: string;
  entryFee: number;
  slot: number | null;
  roomCredsSent: boolean;
  kills: number;
  resultRank: number | null;
  prizeAmount: number;
  payoutStatus: 'pending' | 'completed';
  createdAt: string;
}

interface TournamentData {
  tournamentName: string;
  entryFee: number;
  tournamentType: 'Solo' | 'Duo' | 'Squad';
  maxTeams: number;
  status: 'Open' | 'Closed';
}

interface RegistrationWizardProps {
  tournamentId: string;
}

const RegistrationWizard = ({ tournamentId }: RegistrationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    teamName: '',
    captainContact: '',
    captainEmail: '',
    players: [
      { ign: '', uid: '' },
      { ign: '', uid: '' },
      { ign: '', uid: '' },
      { ign: '', uid: '' }
    ],
    paymentStatus: 'pending',
    receiptUrl: null,
    tournamentId,
    tournamentName: '',
    entryFee: 0,
    slot: null,
    roomCredsSent: false,
    kills: 0,
    resultRank: null,
    prizeAmount: 0,
    payoutStatus: 'pending',
    createdAt: new Date().toISOString()
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  // Fetch tournament details
  useState(() => {
    const fetchTournamentDetails = async () => {
      try {
        const tournamentRef = doc(db, 'tournaments', tournamentId);
        const tournamentSnap = await getDoc(tournamentRef);
        
        if (tournamentSnap.exists()) {
          const data = tournamentSnap.data() as TournamentData;
          setTournamentData(data);
          setFormData(prev => ({
            ...prev,
            tournamentName: data.tournamentName,
            entryFee: data.entryFee
          }));
        } else {
          toast({
            title: "Tournament Not Found",
            description: "The tournament you're trying to register for doesn't exist.",
            variant: "destructive"
          });
          navigate('/tournaments');
        }
      } catch (error) {
        console.error('Error fetching tournament details:', error);
        toast({
          title: "Error",
          description: "Failed to load tournament details. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchTournamentDetails();
  }, [tournamentId]);

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
  
  // Upload receipt to Firebase Storage
  const uploadReceipt = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `receipts/${uuidv4()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmitRegistration = async (receiptFile: File | null) => {
    if (!receiptFile) {
      toast({
        title: "Receipt Required",
        description: "Please upload your payment receipt to complete registration.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Upload receipt image
      const receiptUrl = await uploadReceipt(receiptFile);
      
      // Update formData with receipt URL
      const updatedFormData = {
        ...formData,
        receiptUrl,
        createdAt: new Date().toISOString()
      };
      
      // Save registration to Firestore
      const registrationRef = await addDoc(collection(db, 'teams'), updatedFormData);
      
      // Create player profiles in Firestore
      const captainProfile = {
        name: updatedFormData.players[0].name || '',
        phone: updatedFormData.captainContact,
        email: updatedFormData.captainEmail,
        uid: updatedFormData.players[0].uid,
        isLocked: true
      };
      
      await addDoc(collection(db, 'players'), captainProfile);
      
      setRegistrationId(registrationRef.id);
      setRegistrationSuccess(true);
      setCurrentStep(steps.length - 1);
      
      toast({
        title: "Registration Complete!",
        description: "Your squad has been registered successfully.",
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate UPI link
  const getUpiLink = (): string => {
    return generateUpiLink(formData.teamName, formData.tournamentName, formData.entryFee);
  };

  const steps = [
    { name: 'Team Info', component: TeamInfoStep },
    { name: 'Players', component: PlayersStep },
    { name: 'Payment', component: PaymentStep },
    { name: 'Confirmation', component: ConfirmationStep }
  ];

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
          isLoading={isLoading}
          registrationSuccess={registrationSuccess}
          registrationId={registrationId}
          upiLink={getUpiLink()}
        />
      </motion.div>
    </div>
  );
};

export default RegistrationWizard;
