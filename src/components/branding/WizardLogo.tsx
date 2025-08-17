import { cn } from "@/lib/utils";

interface WizardLogoProps {
  className?: string;
}

export function WizardLogo({ className }: WizardLogoProps) {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Wizard Hat */}
        <path
          d="M24 4L8 36H40L24 4Z"
          fill="url(#gradient1)"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Hat Brim */}
        <ellipse
          cx="24"
          cy="36"
          rx="18"
          ry="4"
          fill="url(#gradient2)"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Stars */}
        <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.8" />
        <circle cx="28" cy="16" r="1" fill="white" opacity="0.6" />
        <circle cx="24" cy="26" r="1.2" fill="white" opacity="0.7" />
        <circle cx="16" cy="28" r="0.8" fill="white" opacity="0.5" />
        <circle cx="32" cy="24" r="1" fill="white" opacity="0.6" />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
