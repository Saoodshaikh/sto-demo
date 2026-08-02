'use client';

import SmoothScroll from '@/components/providers/SmoothScroll';
import CinematicExperience from '@/components/cinematic/CinematicExperience';

export default function Home() {
  return (
    <SmoothScroll>
      <CinematicExperience />
    </SmoothScroll>
  );
}
