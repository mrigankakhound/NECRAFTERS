import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  text = "Loading...",
  className = "" 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Animated Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full`}></div>
        <div className={`${sizeClasses[size]} border-2 border-orange-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
      
      {/* Loading Text */}
      {text && (
        <div className="text-center">
          <p className={`${textSizes[size]} text-gray-600 font-medium`}>
            {text}
          </p>
          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-1">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
