import React from 'react';

export const Card = React.forwardRef(function Card({ className = '', ...props }, ref) {
  return <div ref={ref} className={`ui-card ${className}`.trim()} {...props} />;
});

export const CardHeader = React.forwardRef(function CardHeader({ className = '', ...props }, ref) {
  return <div ref={ref} className={`ui-card__header ${className}`.trim()} {...props} />;
});

export const CardTitle = React.forwardRef(function CardTitle({ className = '', ...props }, ref) {
  return <h3 ref={ref} className={`ui-card__title ${className}`.trim()} {...props} />;
});

export const CardDescription = React.forwardRef(function CardDescription({ className = '', ...props }, ref) {
  return <p ref={ref} className={`ui-card__description ${className}`.trim()} {...props} />;
});

export const CardContent = React.forwardRef(function CardContent({ className = '', ...props }, ref) {
  return <div ref={ref} className={`ui-card__content ${className}`.trim()} {...props} />;
});

export const CardFooter = React.forwardRef(function CardFooter({ className = '', ...props }, ref) {
  return <div ref={ref} className={`ui-card__footer ${className}`.trim()} {...props} />;
});
