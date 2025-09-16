import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModernInputProps extends React.ComponentProps<"input"> {
  variant?: 'default' | 'search' | 'modern';
  showPasswordToggle?: boolean;
  showClearButton?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({
    className,
    type = "text",
    variant = "default",
    showPasswordToggle,
    showClearButton,
    leftIcon,
    rightIcon,
    error,
    success,
    value,
    onChange,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || "");

    const inputType = showPasswordToggle && showPassword ? "text" : type;

    const handleClear = () => {
      setInputValue("");
      onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    const getVariantClasses = () => {
      switch (variant) {
        case 'search':
          return cn(
            "h-11 pl-12 pr-4 rounded-xl",
            "bg-white/60 backdrop-blur-sm border-gray-200/60",
            "hover:bg-white/80 hover:border-gray-300/60",
            "focus:bg-white/90 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-100/50",
            "placeholder:text-gray-400 text-gray-900"
          );
        case 'modern':
          return cn(
            "h-12 px-4 rounded-xl",
            "bg-white/50 backdrop-blur-sm border border-gray-200/60",
            "hover:bg-white/70 hover:border-gray-300/60 hover:shadow-sm",
            "focus:bg-white/90 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-100/50 focus:shadow-md",
            "placeholder:text-gray-400 text-gray-900 transition-all duration-200",
            error && "border-red-300/60 focus:border-red-400/60 focus:ring-red-100/50",
            success && "border-green-300/60 focus:border-green-400/60 focus:ring-green-100/50"
          );
        default:
          return cn(
            "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            success && "border-green-500 focus-visible:ring-green-500"
          );
      }
    };

    return (
      <div className="relative">
        {variant === 'search' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
        )}

        {leftIcon && variant === 'modern' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}

        <input
          type={inputType}
          className={cn(
            getVariantClasses(),
            leftIcon && variant === 'modern' && "pl-12",
            (rightIcon || showPasswordToggle || (showClearButton && inputValue)) && "pr-12"
          )}
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />

        {rightIcon && variant === 'modern' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}

        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-500" />
            ) : (
              <Eye className="w-4 h-4 text-gray-500" />
            )}
          </Button>
        )}

        {showClearButton && inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={handleClear}
          >
            <X className="w-4 h-4 text-gray-500" />
          </Button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
