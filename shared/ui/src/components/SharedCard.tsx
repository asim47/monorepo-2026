import type { ReactNode } from 'react';

export interface SharedCardProps {
  title: string;
  children?: ReactNode;
}

export function SharedCard({ title, children }: SharedCardProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">{title}</h2>
      <div className="text-sm text-gray-700">{children}</div>
    </section>
  );
}

