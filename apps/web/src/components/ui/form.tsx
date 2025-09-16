'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn(
          'group relative space-y-2 rounded-xl p-4 transition-all duration-200',
          'bg-white/50 backdrop-blur-sm border border-gray-200/60',
          'hover:bg-white/70 hover:border-gray-300/60 hover:shadow-sm',
          'focus-within:bg-white/80 focus-within:border-blue-300/60 focus-within:shadow-md focus-within:ring-1 focus-within:ring-blue-100',
          className
        )}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        'text-gray-700 group-focus-within:text-blue-700 transition-colors duration-200',
        error && 'text-red-600',
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn(
        'text-[0.8rem] text-gray-500 leading-relaxed',
        'flex items-center gap-2',
        className
      )}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        'text-[0.8rem] font-medium flex items-center gap-2 mt-2',
        'text-red-600 bg-red-50/80 border border-red-200/60 rounded-lg px-3 py-2',
        'animate-in slide-in-from-left-1 duration-200',
        className
      )}
      {...props}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

// Modern Form Section Component
interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6 p-6 rounded-2xl',
          'bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm',
          'border border-gray-200/60 shadow-sm',
          'hover:shadow-md transition-all duration-300',
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="flex items-start gap-3">
            {icon && (
              <div className="flex-shrink-0 p-2 rounded-xl bg-blue-50 border border-blue-100">
                {icon}
              </div>
            )}
            <div className="space-y-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    );
  }
);
FormSection.displayName = 'FormSection';

// Modern Form Success Message
interface FormSuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
}

const FormSuccess = React.forwardRef<HTMLDivElement, FormSuccessProps>(
  ({ className, title = 'Success!', message, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 p-4 rounded-xl',
          'bg-green-50/80 border border-green-200/60',
          'animate-in slide-in-from-bottom-2 duration-300',
          className
        )}
        {...props}
      >
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-green-900">{title}</h4>
          {message && (
            <p className="text-sm text-green-700 leading-relaxed">{message}</p>
          )}
          {children}
        </div>
      </div>
    );
  }
);
FormSuccess.displayName = 'FormSuccess';

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormSection,
  FormSuccess,
};
