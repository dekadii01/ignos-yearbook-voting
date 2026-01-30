import { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  className?: string;
}

export function GlassButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}: GlassButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 overflow-hidden';
  
  const sizeClasses = {
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const variantClasses = {
    primary: disabled
      ? 'bg-gray-300/40 text-gray-400 cursor-not-allowed backdrop-blur-xl border border-gray-300/40'
      : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 border border-gray-700/50',
    secondary: disabled
      ? 'bg-white/20 text-gray-400 cursor-not-allowed backdrop-blur-xl border border-white/30'
      : 'bg-white/30 text-gray-900 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] hover:bg-white/40 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {/* Inner glow effect for primary variant */}
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
