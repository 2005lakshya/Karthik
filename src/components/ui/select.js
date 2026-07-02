import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;
export const SelectLabel = SelectPrimitive.Label;
export const SelectScrollUpButton = SelectPrimitive.ScrollUpButton;
export const SelectScrollDownButton = SelectPrimitive.ScrollDownButton;

export const SelectTrigger = React.forwardRef(function SelectTrigger(
  { className = '', children, ...props },
  ref
) {
  return (
    <SelectPrimitive.Trigger ref={ref} className={`ui-select-trigger ${className}`.trim()} {...props}>
      <span className="ui-select-trigger__content">{children}</span>
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="ui-select-trigger__chevron" aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = React.forwardRef(function SelectContent(
  { className = '', children, position = 'popper', ...props },
  ref
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content ref={ref} className={`ui-select-content ${className}`.trim()} position={position} {...props}>
        <SelectScrollUpButton className="ui-select-scroll-btn">
          <ChevronUp className="ui-select-scroll-icon" aria-hidden="true" />
        </SelectScrollUpButton>
        <SelectPrimitive.Viewport className="ui-select-viewport">{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton className="ui-select-scroll-btn">
          <ChevronDown className="ui-select-scroll-icon" aria-hidden="true" />
        </SelectScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectItem = React.forwardRef(function SelectItem(
  { className = '', children, ...props },
  ref
) {
  return (
    <SelectPrimitive.Item ref={ref} className={`ui-select-item ${className}`.trim()} {...props}>
      <span className="ui-select-item__indicator">
        <SelectPrimitive.ItemIndicator>
          <Check className="ui-select-item__check" aria-hidden="true" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

export const SelectSeparator = SelectPrimitive.Separator;
