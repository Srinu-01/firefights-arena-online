
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between items-center w-full mb-8">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className={`
              flex items-center justify-center rounded-full w-10 h-10 
              ${isCompleted ? 'bg-gaming-orange' : isActive ? 'bg-gaming-orange/80' : 'bg-gaming-gray'} 
              transition-colors duration-300
            `}>
              {isCompleted ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white font-bold">{index + 1}</span>
              )}
            </div>
            
            <span className={`
              text-xs mt-1 font-medium hidden sm:block
              ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}
            `}>
              {step}
            </span>
            
            {index < steps.length - 1 && (
              <div className="absolute hidden sm:block">
                <div 
                  className={`h-0.5 w-full ${isCompleted ? 'bg-gaming-orange' : 'bg-gaming-gray'}`} 
                  style={{width: '100%'}}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
