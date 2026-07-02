import React from 'react';

export const Badge = React.forwardRef(function Badge({ className = '', variant = 'default', ...props }, ref) {
  return <span ref={ref} className={`ui-badge ui-badge--${variant} ${className}`.trim()} {...props} />;
});

Badge.displayName = 'Badge';
