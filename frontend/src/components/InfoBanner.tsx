import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoBannerProps {
  children: ReactNode;
  icon?: LucideIcon;
  emoji?: string;
  isLightTheme: boolean;
  variant?: 'info' | 'success' | 'warning' | 'premium';
  className?: string;
}

export function InfoBanner({
  children,
  icon: Icon,
  emoji,
  isLightTheme,
  variant = 'info',
  className = '',
}: InfoBannerProps) {
  const variantClasses = {
    info: isLightTheme
      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
      : 'bg-blue-950 border-blue-900 hover:bg-blue-900',
    success: isLightTheme
      ? 'bg-green-50 border-green-200 hover:bg-green-100'
      : 'bg-green-950 border-green-900 hover:bg-green-900',
    warning: isLightTheme
      ? 'bg-amber-50 border-amber-200 hover:bg-amber-100'
      : 'bg-amber-950 border-amber-900 hover:bg-amber-900',
    premium: isLightTheme
      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100'
      : 'bg-gradient-to-r from-blue-950 to-indigo-950 border-blue-900 hover:from-blue-900 hover:to-indigo-900',
  };

  const textClasses = {
    info: isLightTheme ? 'text-blue-800' : 'text-blue-200',
    success: isLightTheme ? 'text-green-800' : 'text-green-200',
    warning: isLightTheme ? 'text-amber-800' : 'text-amber-200',
    premium: isLightTheme ? 'text-blue-900' : 'text-blue-100',
  };

  const iconBgClasses = {
    info: isLightTheme ? 'bg-blue-100' : 'bg-blue-900',
    success: isLightTheme ? 'bg-green-100' : 'bg-green-900',
    warning: isLightTheme ? 'bg-amber-100' : 'bg-amber-900',
    premium: isLightTheme ? 'bg-blue-200' : 'bg-blue-800',
  };

  const iconClasses = {
    info: isLightTheme ? 'text-blue-600' : 'text-blue-400',
    success: isLightTheme ? 'text-green-600' : 'text-green-400',
    warning: isLightTheme ? 'text-amber-600' : 'text-amber-400',
    premium: isLightTheme ? 'text-blue-700' : 'text-blue-300',
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-start gap-3">
        {(Icon || emoji) && (
          <div className={`p-2 rounded-lg shrink-0 ${iconBgClasses[variant]}`}>
            {Icon ? (
              <Icon className={`w-5 h-5 ${iconClasses[variant]}`} />
            ) : (
              <span className="text-lg">{emoji}</span>
            )}
          </div>
        )}
        <div className={`flex-1 ${textClasses[variant]}`}>{children}</div>
      </div>
    </div>
  );
}
