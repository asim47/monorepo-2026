import HomePage from '@/components/home';
import React from 'react';
import { SharedCard } from '@shared/ui';

const page = () => {
  return (
    <div className="space-y-4">
      <SharedCard title="Shared UI component">
        This card is imported from <code>@repo/ui</code>.
      </SharedCard>
      <HomePage />
    </div>
  );
};

export default page;
