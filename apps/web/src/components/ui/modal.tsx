'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

// Modern Modal Overlay with enhanced backdrop
const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-in fade-in duration-300',
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/10 before:to-purple-500/10 before:animate-pulse',
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Modern Modal Content with glass morphism and animations
const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    showMaximizeButton?: boolean;
  }
>(({ className, children, size = 'md', showCloseButton = true, showMaximizeButton = false, ...props }, ref) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  return (
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full gap-0 border p-0 shadow-2xl duration-300',
        'translate-x-[-50%] translate-y-[-50%]',
        'bg-white/95 backdrop-blur-xl border-gray-200/60',
        'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4',
        sizeClasses[size],
        isMaximized && 'max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh]',
        className
      )}
      {...props}
    >
      <div className="relative rounded-2xl overflow-hidden">
        {/* Header with controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>

          <div className="flex items-center gap-2">
            {showMaximizeButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMaximized(!isMaximized)}
                className="h-8 w-8 p-0 hover:bg-gray-200/60"
              >
                {isMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}

            {showCloseButton && (
              <DialogPrimitive.Close className="h-8 w-8 rounded-md p-0 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </DialogPrimitive.Content>
  );
});
ModalContent.displayName = DialogPrimitive.Content.displayName;

// Modern Modal Header
const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
  }
>(({ className, icon, title, subtitle, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-3 pb-4 border-b border-gray-200/60',
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-4">
      {icon && (
        <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
          {icon}
        </div>
      )}
      <div className="flex-1 space-y-1">
        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {children}
  </div>
));
ModalHeader.displayName = 'ModalHeader';

// Modern Modal Body
const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-4', className)}
    {...props}
  />
));
ModalBody.displayName = 'ModalBody';

// Modern Modal Footer
const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-3 pt-4 border-t border-gray-200/60',
      'bg-gray-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl',
      className
    )}
    {...props}
  />
));
ModalFooter.displayName = 'ModalFooter';

// Confirmation Modal - Specialized for confirmations
interface ConfirmationModalProps extends React.ComponentProps<typeof Modal> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ConfirmationModal = React.forwardRef<
  React.ElementRef<typeof Modal>,
  ConfirmationModalProps
>(({
  variant = 'info',
  icon,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  children,
  ...props
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-50/80 border-green-200/60',
          icon: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50/80 border-yellow-200/60',
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50/80 border-red-200/60',
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          bg: 'bg-blue-50/80 border-blue-200/60',
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal {...props}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className={cn('max-w-md', styles.bg)}>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              {icon && (
                <div className="flex-shrink-0 p-2 rounded-lg bg-white/60 border border-gray-200/60">
                  <div className={styles.icon}>
                    {icon}
                  </div>
                </div>
              )}
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {children}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/60">
              <ModalClose asChild>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
              </ModalClose>

              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(styles.button)}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : null}
                {confirmText}
              </Button>
            </div>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
});
ConfirmationModal.displayName = 'ConfirmationModal';

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ConfirmationModal,
};
