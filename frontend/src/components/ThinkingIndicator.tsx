interface ThinkingIndicatorProps {
  isLightTheme: boolean;
}

export function ThinkingIndicator({ isLightTheme }: ThinkingIndicatorProps) {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="max-w-[80%] mr-12">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isLightTheme ? 'bg-slate-100' : 'bg-slate-800'
          }`}>
            💎
          </div>
          <div className={`rounded-2xl px-4 py-3 ${
            isLightTheme 
              ? 'bg-slate-100 text-slate-900' 
              : 'bg-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full animate-thinking-pulse ${
                isLightTheme ? 'bg-slate-400' : 'bg-slate-500'
              }`} style={{ animationDelay: '0s' }}></div>
              <div className={`w-2 h-2 rounded-full animate-thinking-pulse ${
                isLightTheme ? 'bg-slate-400' : 'bg-slate-500'
              }`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`w-2 h-2 rounded-full animate-thinking-pulse ${
                isLightTheme ? 'bg-slate-400' : 'bg-slate-500'
              }`} style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
