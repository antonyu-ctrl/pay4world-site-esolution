import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function ProgressSteps({
  steps,
  currentStep,
  className,
}: ProgressStepsProps) {
  return (
    <div className={cn('flex items-center justify-center w-full', className)}>
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isUpcoming = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                  isCompleted && 'bg-brand-600 text-white',
                  isCurrent && 'bg-brand-600 text-white ring-4 ring-brand-100',
                  isUpcoming && 'border-2 border-gray-300 text-gray-400',
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium whitespace-nowrap',
                  isCurrent ? 'text-brand-600' : isCompleted ? 'text-gray-700' : 'text-gray-400',
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-12 sm:w-20 h-0.5 mx-2 mb-6',
                  step.number < currentStep ? 'bg-brand-600' : 'bg-gray-300',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
