import React from 'react';
import { Check } from 'lucide-react';
import type { ClientStatus } from '../../types';
import { CLIENT_STATUS_STEPS } from '../../utils/labels';

interface ClientStatusStepperProps {
  status: ClientStatus;
  onChange?: (status: ClientStatus) => void;
  readonly?: boolean;
}

const stepIndex = (status: ClientStatus) =>
  CLIENT_STATUS_STEPS.findIndex((s) => s.key === status);

export const ClientStatusStepper = ({ status, onChange, readonly }: ClientStatusStepperProps) => {
  const currentIdx = stepIndex(status);

  return (
    <div className="w-full">
      <div className="flex items-center">
        {CLIENT_STATUS_STEPS.map((step, idx) => {
          const isPassed = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isFuture = idx > currentIdx;
          const isLast = idx === CLIENT_STATUS_STEPS.length - 1;

          return (
            <React.Fragment key={step.key}>
              {/* Step node */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => !readonly && onChange?.(step.key)}
                  disabled={readonly}
                  title={step.label}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 focus:outline-none ${
                    isCurrent
                      ? 'border-gold bg-gold text-bg-primary shadow-gold animate-pulse-gold'
                      : isPassed
                      ? 'border-success bg-success/15 text-success hover:bg-success/25'
                      : 'border-border bg-bg-secondary text-cream-subtle hover:border-border-light'
                  } ${!readonly ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {isPassed ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <span className={`font-mono text-xs font-bold ${isCurrent ? 'text-bg-primary' : ''}`}>
                      {idx + 1}
                    </span>
                  )}
                </button>
                <span className={`mt-2 text-2xs text-center max-w-[70px] leading-tight transition-colors duration-200 ${
                  isCurrent ? 'text-gold font-semibold' :
                  isPassed ? 'text-success' :
                  'text-cream-subtle'
                }`}>
                  {step.short}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 h-0.5 relative mt-[-18px]">
                  <div className="absolute inset-0 bg-border rounded-full" />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                      width: isPassed ? '100%' : isCurrent ? '50%' : '0%',
                      background: isPassed
                        ? 'linear-gradient(90deg, #5ABF8A, #5ABF8A)'
                        : 'linear-gradient(90deg, #C9A227, #D4B445)',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
