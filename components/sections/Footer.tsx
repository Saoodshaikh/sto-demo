export default function Footer() {
  const cols = [
    {
      title: 'Platform',
      links: ['Discovery', 'Talent Graph', 'Commerce', 'Payments'],
    },
    {
      title: 'For',
      links: ['Talent', 'Brands', 'Recruiters', 'Agencies'],
    },
    {
      title: 'Company',
      links: ['Vision', 'Careers', 'Press', 'Investors'],
    },
  ];

  return (
    <footer className="relative border-t border-white/8 bg-ink/70 py-16 section-pad backdrop-blur">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute h-2 w-2 rounded-full bg-cyan" />
              <span className="absolute h-6 w-6 rounded-full border border-electric/50" />
            </span>
            <span className="font-display text-sm font-semibold tracking-[0.25em] text-white">
              SELECT TALENT CO
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/62">
            The operating system for the global talent economy. Built with
            intelligence. Starting in India.
          </p>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-xs uppercase tracking-[0.28em] text-white/62">
              {c.title}
            </p>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    data-hover
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="hairline my-12" />

      <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/60 sm:flex-row">
        <p>© {new Date().getFullYear()} Select Talent Co. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" data-hover className="hover:text-white/70">Privacy</a>
          <a href="#" data-hover className="hover:text-white/70">Terms</a>
          <a href="#" data-hover className="hover:text-white/70">Security</a>
        </div>
      </div>
    </footer>
  );
}
