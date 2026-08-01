'use client';

import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/providers/SmoothScroll';
import Loader from '@/components/ui/Loader';
import Cursor from '@/components/ui/Cursor';
import Navbar from '@/components/ui/Navbar';
import ScrollRail from '@/components/ui/ScrollRail';
import Hero from '@/components/sections/Hero';
import Story from '@/components/sections/Story';
import Intelligence from '@/components/sections/Intelligence';
import TalentVerticals from '@/components/sections/TalentVerticals';
import Journeys from '@/components/sections/Journeys';
import Ecosystem from '@/components/sections/Ecosystem';
import TechSecurity from '@/components/sections/TechSecurity';
import Roadmap from '@/components/sections/Roadmap';
import Vision from '@/components/sections/Vision';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';

// The WebGL scene is client-only and code-split so it never blocks first paint.
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <Loader />
      <Cursor />

      {/* Fixed cinematic WebGL backdrop — lives behind the entire document. */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      <Navbar />
      <ScrollRail />

      <main className="relative z-10">
        {/* Hero + storytelling sit directly over the living particle field. */}
        <Hero />
        <Story />

        {/* Lower content fades in over the field for readability, while the
            particles resolve into a glowing globe behind the top edge. */}
        <div className="relative bg-gradient-to-b from-ink/80 via-ink to-ink">
          <Intelligence />
          <TalentVerticals />
          <Journeys />
          <Ecosystem />
          <TechSecurity />
          <Roadmap />
          <Vision />
          <CTA />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}
