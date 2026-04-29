import { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-forge-500 font-semibold mb-4">
      <span className="h-px w-8 bg-forge-500" />
      {children}
    </div>
  );
}

export function H2({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight ${light ? 'text-cream-50' : 'text-steel-900'}`}>
      {children}
    </h2>
  );
}

export function Lead({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-lg md:text-xl leading-relaxed ${light ? 'text-cream-200/80' : 'text-steel-600'}`}>
      {children}
    </p>
  );
}
