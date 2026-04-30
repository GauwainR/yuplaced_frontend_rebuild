import type { ReactNode } from 'react';

type BadgeTone = 'high' | 'medium' | 'low' | 'default';

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return <span className={`yn-badge yn-badge-${tone}`}>{children}</span>;
}
