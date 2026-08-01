/** All human-readable content for the STC experience lives here — no lorem. */

export const STORY = [
  {
    kicker: 'The Problem',
    title: 'Talent is everywhere.\nDiscovery is not.',
    body:
      'Millions of extraordinary people — artists, athletes, models, performers, creators and specialists — remain invisible to the opportunities built for them. Not for lack of ability. For lack of infrastructure.',
  },
  {
    kicker: 'The Shift',
    title: 'Intelligence enters\nthe room.',
    body:
      'STC deploys AI that understands craft, context and potential — reading talent the way a great agent would, at the scale of a nation.',
  },
  {
    kicker: 'Discovery',
    title: 'Hidden talent\nbecomes visible.',
    body:
      'Our models surface the right person for the right moment — ranked by fit, verified by data, and ready to be discovered by those searching for them.',
  },
  {
    kicker: 'Connection',
    title: 'Recruiters and brands\nconnect instantly.',
    body:
      'Recruiters, agencies, production houses and brands are matched to verified talent in seconds — with intelligence handling the noise so people handle the decisions.',
  },
  {
    kicker: 'Growth',
    title: 'Careers compound.',
    body:
      'Every booking, credit and collaboration strengthens a living profile — turning scattered work into a career that grows with reputation and reach.',
  },
  {
    kicker: 'The Future',
    title: 'An operating system\nfor talent.',
    body:
      'Discovery, management, commerce and payments — one intelligent layer beneath the entire talent economy. Starting in India. Built for the world.',
  },
];

export const INTELLIGENCE = [
  {
    title: 'Talent Graph',
    desc: 'A living knowledge graph of skills, credits, style and reputation — the substrate every match is drawn from.',
  },
  {
    title: 'Semantic Discovery',
    desc: 'Search talent by intent, not keywords. “A soulful indie vocalist for a monsoon campaign” returns people, ranked.',
  },
  {
    title: 'Fit Scoring',
    desc: 'Multimodal models score alignment across brief, budget, availability, aesthetic and track record.',
  },
  {
    title: 'Verified Identity',
    desc: 'Every profile is authenticity-checked, so brands hire signal — not fabricated followings.',
  },
];

export const JOURNEYS = [
  {
    id: 'talent',
    label: 'For Talent',
    headline: 'Be discovered for who you truly are.',
    points: [
      'One profile that showcases work, credits and range',
      'AI puts you in front of the right opportunities',
      'Get booked, paid and reviewed — all in one place',
    ],
    metric: 'Undiscovered → In-demand',
  },
  {
    id: 'brand',
    label: 'For Brands',
    headline: 'Cast the perfect face, voice or team — in minutes.',
    points: [
      'Describe the brief; receive a ranked shortlist',
      'Verified reach, rights and availability up front',
      'Contract, pay and manage the campaign end to end',
    ],
    metric: 'Weeks of casting → Minutes',
  },
  {
    id: 'recruiter',
    label: 'For Recruiters',
    headline: 'A search engine for human potential.',
    points: [
      'Query the talent graph by skill, style and fit',
      'Pipelines that update themselves as talent grows',
      'Collaborate, shortlist and close inside one workspace',
    ],
    metric: '10,000 profiles → 1 right hire',
  },
  {
    id: 'artist',
    label: 'For Artists & Agencies',
    headline: 'Manage a roster like a modern studio.',
    points: [
      'Represent talent with dashboards, not spreadsheets',
      'Track bookings, rights, royalties and payouts',
      'Grow reputation with verified, portable credits',
    ],
    metric: 'Scattered work → Managed careers',
  },
];

export const STATS = [
  { value: '1.4B+', label: 'People in the market STC begins with' },
  { value: '90%', label: 'Of talent never reaches the right brief' },
  { value: '<60s', label: 'From brief to a ranked, verified shortlist' },
  { value: '1', label: 'Operating system for the talent economy' },
];

export const TECH = [
  { name: 'AI Matching Engine', detail: 'Multimodal embeddings across text, image, audio & video' },
  { name: 'Talent Graph DB', detail: 'Real-time relationship graph at population scale' },
  { name: 'Commerce & Payments', detail: 'Contracts, escrow and payouts built in' },
  { name: 'Trust & Verification', detail: 'Identity, rights and authenticity checks' },
  { name: 'Realtime Cloud', detail: 'Elastic, GPU-backed, globally distributed' },
  { name: 'Creator SDK', detail: 'APIs for agencies, studios and platforms to build on' },
];

export const SECURITY = [
  { title: 'Encryption everywhere', desc: 'AES-256 at rest, TLS 1.3 in transit, per-tenant isolation.' },
  { title: 'Consent-first data', desc: 'Talent owns their data and controls every share and payout.' },
  { title: 'Rights management', desc: 'Usage, licensing and royalty terms enforced on every deal.' },
  { title: 'Compliance ready', desc: 'Built toward SOC 2, ISO 27001 and India DPDP alignment.' },
];

export const TALENT_TYPES = [
  { name: 'Singers', tagline: 'Voices that move millions', desc: 'Playback, indie, classical, pop — discovered by tone, range and reach.', accent: '#ff5da2' },
  { name: 'Musicians', tagline: 'Every instrument, every genre', desc: 'Session players to composers, matched to the exact sound a brief needs.', accent: '#42e8ff' },
  { name: 'Guitarists', tagline: 'Strings that tell stories', desc: 'From acoustic soul to electric fire — surfaced by style and signature.', accent: '#ffb454' },
  { name: 'DJs', tagline: 'Architects of the drop', desc: 'Club, festival and brand sets, ranked by energy, crowd and catalogue.', accent: '#4f7bff' },
  { name: 'Dancers', tagline: 'Motion as language', desc: 'Contemporary, classical, street — discovered by movement and presence.', accent: '#a78bfa' },
  { name: 'Actors', tagline: 'Faces of a thousand roles', desc: 'Film, ad and stage talent, cast by range, look and verified credits.', accent: '#f472b6' },
  { name: 'Models', tagline: 'Presence, framed', desc: 'Runway, editorial and commercial faces with verified reach and rights.', accent: '#e5e7eb' },
  { name: 'Content Creators', tagline: 'Culture, at scale', desc: 'Short-form to long-form makers matched to a brand’s voice and audience.', accent: '#34d399' },
  { name: 'Influencers', tagline: 'Reach with resonance', desc: 'Real, verified audiences — measured by trust, not just follower counts.', accent: '#f59e0b' },
  { name: 'Athletes', tagline: 'Discipline in motion', desc: 'Sports talent for endorsements, events and stories that inspire.', accent: '#22d3ee' },
  { name: 'Anchors', tagline: 'The voice of the moment', desc: 'Hosts and presenters for stage, screen and stream, matched to tone.', accent: '#60a5fa' },
  { name: 'Photographers', tagline: 'Light, captured', desc: 'Fashion, product and story shooters discovered by eye and body of work.', accent: '#c084fc' },
  { name: 'Filmmakers', tagline: 'Worlds, directed', desc: 'Directors and cinematographers matched to vision, craft and scale.', accent: '#fb7185' },
  { name: 'Performers', tagline: 'Live, unforgettable', desc: 'Stage and event artists who turn a moment into a memory.', accent: '#2dd4bf' },
];

export const ROADMAP = [
  {
    phase: 'Now',
    title: 'Discovery & Profiles',
    desc: 'AI talent graph, verified profiles and semantic discovery go live across India.',
  },
  {
    phase: 'Next',
    title: 'Commerce & Management',
    desc: 'Bookings, contracts, escrow payments and agency dashboards.',
  },
  {
    phase: 'Later',
    title: 'Talent Marketplace',
    desc: 'An open marketplace where opportunities and talent transact at scale.',
  },
  {
    phase: 'Vision',
    title: 'Global Talent OS',
    desc: 'The intelligent infrastructure layer beneath the world’s talent economy.',
  },
];
