import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface WaldoInputProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size: 'lg' | 'md' | 'sm';
}

const WaldoInput = React.forwardRef<HTMLButtonElement, WaldoInputProps>(
  ({ className, asChild = false, size, ...props }) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <div className="flex cursor-pointer">
        <div className="  rounded-lg bg-gradient-to-r from-[#6F1DD8] to-[#A21CAF] p-[1px]">
          <div className="bg-[#16182c] h-full opacity-[1] rounded-lg">
            <input
              className={cn(
                `flex h-full text-white focus:outline-none px-3 ${
                  size == 'lg' ? 'py-4' : size == 'md' ? 'py-4' : 'py-2'
                } ${
                  size == 'lg' ? 'w-22' : size == 'md' ? 'w-18' : 'w-16'
                }  items-center justify-center bg-[#E545FF] bg-opacity-[0.07]`,
                className,
              )}
            />
          </div>
        </div>
      </div>
    );
  },
);

WaldoInput.displayName = 'WaldoInput';

export { WaldoInput };
