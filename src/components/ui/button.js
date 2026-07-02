import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'default', size = 'default', asChild = false, type = 'button', ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      className={`ui-button ui-button--${variant} ui-button--${size} ${className}`.trim()}
      {...props}
    />
  );
});

Button.displayName = 'Button';
