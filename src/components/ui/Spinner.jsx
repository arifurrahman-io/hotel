import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-16 h-16",
  };

  const classes = twMerge(
    clsx("text-indigo-600 animate-spin", sizeClasses[size], className)
  );

  return <Loader2 className={classes} />;
};

export default Spinner;
