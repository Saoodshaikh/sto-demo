'use client';

import SmoothScroll from '@/components/providers/SmoothScroll';
import Cursor from '@/components/ui/Cursor';
import Navbar from '@/components/ui/Navbar';
import PremiumBackground from '@/components/ui/PremiumBackground';
import Hero from '@/components/sections/Hero';
import Intelligence from '@/components/sections/Intelligence';
import TalentVerticals from '@/components/sections/TalentVerticals';
import Journeys from '@/components/sections/Journeys';
import Ecosystem from '@/components/sections/Ecosystem';
import TechSecurity from '@/components/sections/TechSecurity';
import Roadmap from '@/components/sections/Roadmap';
import Vision from '@/components/sections/Vision';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <SmoothScroll>
      <Cursor />

      {/* Clean, premium animated backdrop (no particles / no grain). */}
      <PremiumBackground />

      <Navbar />

      <main className="relative z-10">
        <Hero />

        {/* Content sits on a clean surface; the aurora glows through the hero. */}
        <div className="relative bg-gradient-to-b from-transparent via-ink/85 to-ink">
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
