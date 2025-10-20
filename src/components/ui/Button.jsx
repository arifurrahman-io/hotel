import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

const Button = ({
  as, // The new polymorphic 'as' prop
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = "",
  ...props
}) => {
  // If 'as' is provided, use it. Otherwise, default to 'button'.
  const Component = as || "button";

  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150";

  const variantStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-indigo-500",
  };

  const sizeStyles = "px-4 py-2 text-sm";
  const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";

  const classes = twMerge(
    clsx(
      baseStyles,
      sizeStyles,
      variantStyles[variant],
      disabledStyles,
      className
    )
  );

  return (
    // Render the dynamic component type
    <Component
      type={Component === "button" ? type : undefined} // Only apply type if it's a button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </Component>
  );
};

export default Button;
