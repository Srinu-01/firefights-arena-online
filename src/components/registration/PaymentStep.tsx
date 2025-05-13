
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { RegistrationData } from './RegistrationWizard';
import QRCode from '@/components/registration/QRCode';

interface PaymentStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (receiptFile: File | null) => Promise<void>;
  isLoading: boolean;
  upiLink: string;
}

const PaymentStep = ({ 
  formData, 
  prevStep, 
  handleSubmit, 
  isLoading,
  upiLink 
}: PaymentStepProps) => {
  const [receipt, setReceipt] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload JPG, PNG, or WEBP images only.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 2MB.",
          variant: "destructive"
        });
        return;
      }
      
      setReceipt(file);
    }
  };

  const handleUpload = async () => {
    if (!receipt) {
      toast({
        title: "Missing Receipt",
        description: "Please upload your payment receipt to continue.",
        variant: "destructive"
      });
      return;
    }

    await handleSubmit(receipt);
  };

  const handlePayWithUPI = () => {
    // Open the UPI link
    window.location.href = upiLink;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Payment</h2>
        <p className="text-sm text-gray-300">Complete payment to finalize registration</p>
      </div>

      <div className="gaming-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Registration Summary</h3>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-300">Team Name:</span>
            <span className="text-white font-medium">{formData.teamName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Captain Contact:</span>
            <span className="text-white font-medium">{formData.captainContact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Tournament:</span>
            <span className="text-white font-medium">{formData.tournamentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Entry Fee:</span>
            <span className="text-white font-bold">₹{formData.entryFee}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mb-6">
          <div className="flex flex-col items-center space-y-4">
            <h4 className="font-medium text-white">Pay using UPI</h4>
            <QRCode value={upiLink} size={200} />
            <p className="text-sm text-gray-300">Scan QR code or click the button below</p>
            <Button 
              className="gaming-button-secondary w-full"
              onClick={handlePayWithUPI}
            >
              Pay Entry Fee ₹{formData.entryFee}
            </Button>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <h4 className="font-medium text-white mb-4">Upload Payment Receipt</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gaming-orange/30 bg-gaming-darker hover:border-gaming-orange/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-white">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG or WEBP (MAX. 2MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            {receipt && (
              <div className="p-2 bg-gaming-darker rounded-md">
                <div className="flex items-center text-white">
                  <span className="text-sm truncate">{receipt.name}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {(receipt.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                className="border-gaming-orange/50 text-white hover:bg-gaming-orange/20"
              >
                Back
              </Button>
              <Button 
                onClick={handleUpload}
                className="gaming-button"
                disabled={!receipt || isLoading}
              >
                {isLoading ? "Uploading..." : "Upload & Complete Registration"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
