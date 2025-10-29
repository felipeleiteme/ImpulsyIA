import { ReactNode } from 'react';
import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  emoji?: string;
  isLightTheme: boolean;
  children: ReactNode;
  variant?: 'default' | 'premium';
  className?: string;
}

export function SectionCard({
  title,
  icon: Icon,
  emoji,
  isLightTheme,
  children,
  variant = 'default',
  className = '',
}: SectionCardProps) {
  const isPremium = variant === 'premium';

  return (
    <Card
      className={`p-5 md:p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
        isPremium
          ? isLightTheme
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300'
            : 'bg-gradient-to-br from-blue-950 to-indigo-950 border-blue-800 hover:border-blue-700'
          : isLightTheme
          ? 'bg-white border-slate-200 hover:border-slate-300'
          : 'bg-slate-900 border-slate-700 hover:border-slate-600'
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`flex items-center gap-2 ${
            isLightTheme ? 'text-slate-900' : 'text-slate-100'
          }`}
        >
          {emoji && <span className="text-xl">{emoji}</span>}
          <span>{title}</span>
        </h2>
        {Icon && (
          <div
            className={`p-2.5 rounded-lg transition-colors ${
              isPremium
                ? isLightTheme
                  ? 'bg-blue-100 hover:bg-blue-200'
                  : 'bg-blue-900 hover:bg-blue-800'
                : isLightTheme
                ? 'bg-slate-100 hover:bg-slate-200'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
            title={title}
          >
            <Icon
              className={`w-5 h-5 ${
                isPremium
                  ? isLightTheme
                    ? 'text-blue-600'
                    : 'text-blue-400'
                  : isLightTheme
                  ? 'text-slate-600'
                  : 'text-slate-400'
              }`}
            />
          </div>
        )}
      </div>
      {children}
    </Card>
  );
}
