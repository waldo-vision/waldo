import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface WaldoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size: 'lg' | 'md' | 'sm';
}

const WaldoButton = React.forwardRef<HTMLButtonElement, WaldoButtonProps>(
  ({ className, asChild = false, size, ...props }) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <div className="flex cursor-pointer transition duration-500 ease-in-out hover:scale-105">
        <div className="  rounded-lg bg-gradient-to-r from-[#6F1DD8] to-[#A21CAF] p-[1px]">
          <div className="bg-[#16182c] h-full opacity-[1] rounded-lg">
            <div
              className={`flex h-full ${
                size == 'lg' ? 'py-4' : size == 'md' ? 'py-4' : 'py-2'
              } ${
                size == 'lg' ? 'px-8' : size == 'md' ? 'px-6' : 'px-5'
              }  items-center justify-center bg-[#E545FF] bg-opacity-[0.07]`}
            >
              <Comp className={cn(className)} {...props} />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

WaldoButton.displayName = 'WaldoButton';

export { WaldoButton };