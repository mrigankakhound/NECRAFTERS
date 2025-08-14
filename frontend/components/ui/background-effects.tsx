import React from 'react';
import { cn } from "@/lib/utils";

interface BackgroundEffectsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'intense';
}

const BackgroundEffects = React.forwardRef<HTMLDivElement, BackgroundEffectsProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute inset-0 pointer-events-none overflow-hidden',
          {
            // Default variant with subtle pattern and single accent
            'bg-chili-pattern': variant === 'default',
            
            // Subtle variant with minimal decoration
            'bg-chili-pattern opacity-[0.02]': variant === 'subtle',
            
            // Intense variant with multiple layers and animations
            'bg-chili-pattern before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent':
              variant === 'intense',
          },
          className
        )}
        {...props}
      >
        {/* Decorative chili accents */}
        {variant === 'intense' && (
          <>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[url('/images/chili-accent.svg')] bg-contain bg-no-repeat opacity-10 rotate-45 animate-float" />
            <div className="absolute top-1/3 -left-20 w-40 h-40 bg-[url('/images/chili-accent.svg')] bg-contain bg-no-repeat opacity-10 -rotate-12 animate-float-delayed" />
            <div className="absolute -bottom-20 right-1/3 w-40 h-40 bg-[url('/images/chili-accent.svg')] bg-contain bg-no-repeat opacity-10 rotate-90 animate-float" />
          </>
        )}

        {/* Spice divider accents */}
        {(variant === 'default' || variant === 'intense') && (
          <>
            <div className="absolute top-20 left-0 right-0 h-4 bg-[url('/images/spice-divider.svg')] bg-repeat-x opacity-10" />
            <div className="absolute bottom-20 left-0 right-0 h-4 bg-[url('/images/spice-divider.svg')] bg-repeat-x opacity-10" />
          </>
        )}
      </div>
    );
  }
);

BackgroundEffects.displayName = 'BackgroundEffects';

export { BackgroundEffects };
