import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Card = ({ children, className = "", ...props }) => {
  const classes = twMerge(
    clsx("bg-white rounded-lg shadow-md border border-gray-200", className)
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// You can create sub-components for consistency
const CardHeader = ({ children, className = "" }) => (
  <div
    className={twMerge(clsx("p-4 sm:p-6 border-b border-gray-200", className))}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={twMerge(clsx("p-4 sm:p-6", className))}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
  <div
    className={twMerge(
      clsx("p-4 sm:p-6 bg-gray-50 border-t border-gray-200", className)
    )}
  >
    {children}
  </div>
);

// Attach sub-components to the main Card component
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
