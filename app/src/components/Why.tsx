import { motion } from 'framer-motion'
import { ExternalLink, Gauge, Timer } from 'lucide-react'
import { card, CountUp, ease, Item, Reveal, Section, SectionHead, Stagger } from '../ui'

const RING = 2 * Math.PI * 52
const BARS = [
  { s: '1s', v: 100, c: 'from-emerald-400 to-emerald-500' },
  { s: '3s', v: 132, c: 'from-amber-400 to-amber-500' },
  { s: '5s', v: 190, c: 'from-rose-400 to-rose-500' },
]

function Src({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-brand">
      {children} <ExternalLink size={11} />
    </a>
  )
}

export default function Why() {
  return (
    <Section id="why" title="Why it matters" alt>
      <SectionHead eyebrow="Why it matters" title={<>Your website is your <span className="text-gradient-brand">hardest-working</span> salesperson.</>} lead="People judge you in seconds. Speed, mobile experience and search visibility decide whether visitors become customers — so we build for all three." />

      <Stagger className="grid gap-5 lg:grid-cols-3">
        {/* bounce chart */}
        <Item className={`${card} p-7 lg:col-span-2`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-ink">Slower pages lose more visitors</h3>
              <p className="mt-1 max-w-md text-sm text-ink-2">Relative chance a mobile visitor leaves, by page load time (1 second = 100).</p>
            </div>
            <span className="rounded-full bg-brand/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-brand">+32% at 3s</span>
          </div>
          <div className="mt-8 flex h-52 items-end gap-5 sm:gap-10">
            {BARS.map((b, k) => (
              <div key={b.s} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="font-mono text-sm font-semibold text-ink">{b.v}</span>
                <motion.div
                  className={`w-full max-w-[120px] rounded-t-2xl bg-linear-to-t ${b.c}`}
                  style={{ height: `${(b.v / 190) * 82}%`, originY: 1 }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.9, delay: 0.15 + k * 0.12, ease }}
                />
                <span className="text-sm font-semibold text-ink-2">{b.s}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-ink-2">
            Google research as summarised by <Src href="https://www.hostinger.com/in/tutorials/website-load-time-statistics/">Hostinger</Src> (+32% from 1s to 3s, +90% from 1s to 5s).
          </p>
        </Item>

        {/* CWV ring */}
        <Item className={`${card} flex flex-col items-center p-7 text-center`}>
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-line" />
              <motion.circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" strokeLinecap="round" className="stroke-brand" strokeDasharray={RING} initial={{ strokeDashoffset: RING }} whileInView={{ strokeDashoffset: RING * (1 - 0.53) }} viewport={{ once: true }} transition={{ duration: 1.4, ease }} />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="text-4xl font-extrabold tracking-tight text-ink">
                <CountUp to={53} suffix="%" />
              </span>
            </div>
          </div>
          <h3 className="mt-5 text-lg font-bold text-ink">of mobile sites pass Core Web Vitals</h3>
          <p className="mt-1 text-sm text-ink-2">Pass them and you beat nearly half the web.</p>
          <div className="mt-3">
            <Src href="https://colorlib.com/wp/site-speed-statistics/">Chrome UX Report via Colorlib</Src>
          </div>
        </Item>

        <Item className={`${card} p-7`}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 text-ok">
            <Timer size={22} />
          </span>
          <div className="mt-5 text-5xl font-extrabold tracking-tight text-ink">
            ≤<CountUp to={2.5} dec={1} suffix="s" />
          </div>
          <h3 className="mt-2 font-bold text-ink">Google’s “good” LCP threshold</h3>
          <p className="mt-1 text-sm text-ink-2">It’s our build target for Pro and Advanced sites.</p>
        </Item>

        <Item className={`${card} p-7`}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-500/10 text-brand-2">
            <Gauge size={22} />
          </span>
          <div className="mt-5 text-5xl font-extrabold tracking-tight text-ink">
            <CountUp to={3} suffix="×" />
          </div>
          <h3 className="mt-2 font-bold text-ink">higher conversion at 1s vs 5s</h3>
          <p className="mt-1 text-sm text-ink-2">B2B sites, correlational and an older study.</p>
          <div className="mt-3">
            <Src href="https://blog.hubspot.com/marketing/page-load-time-conversion-rates">Portent via HubSpot</Src>
          </div>
        </Item>

        <Item className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 to-violet-700 p-7 text-white">
          <div aria-hidden className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
          <h3 className="relative text-xl font-extrabold leading-snug">So we build for speed, search and mobile — from day one.</h3>
          <p className="relative mt-3 text-sm text-indigo-100/85">Every package ships responsive, SEO-ready and performance-tested. Higher tiers add measurable speed targets.</p>
        </Item>
      </Stagger>

      <Reveal className="mt-6">
        <p className="text-xs text-ink-2">Figures are cited from third-party summaries; they show direction, not a guarantee for any individual site.</p>
      </Reveal>
    </Section>
  )
}
