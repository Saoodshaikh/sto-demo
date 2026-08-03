'use client';

import SmoothScroll from '@/components/providers/SmoothScroll';
import CinematicExperience from '@/components/cinematic/CinematicExperience';
import PremiumContent from '@/components/cinematic/PremiumContent';

export default function Home() {
  return (
    <SmoothScroll>
      {/* Emotional cinematic intro */}
      <CinematicExperience />
      {/* Substantive STC story — premium luxury language */}
      <PremiumContent />
    </SmoothScroll>
  );
}
