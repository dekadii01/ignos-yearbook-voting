import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        relative rounded-3xl
        bg-white/20 backdrop-blur-xl
        border border-white/40
        shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]
        ${hover ? 'hover:bg-white/30 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.12)] hover:border-white/60' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
