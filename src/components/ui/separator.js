import React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

export const Separator = React.forwardRef(function Separator(
  { className = '', orientation = 'horizontal', decorative = true, ...props },
  ref
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={`ui-separator ui-separator--${orientation} ${className}`.trim()}
      {...props}
    />
  );
});

Separator.displayName = 'Separator';
