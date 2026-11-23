import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Clock, Compass, Crown, FileText, LifeBuoy, Rocket, Sparkles, TrendingUp, type LucideIcon } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { PACKAGES, type Pkg, type PkgId } from '../data'
import { money } from '../lib'
import { useApp } from '../store'
import { AnimatedNumber, Button, Item, Reveal, Section, SectionHead, Stagger, Switch } from '../ui'

const ICON: Record<PkgId, LucideIcon> = { basic: Rocket, pro: TrendingUp, adv: Crown }

function PackageCard({ p }: { p: Pkg }) {
  const { state, setPkg, goTo } = useApp()
  const [open, setOpen] = useState(false)
  const sel = state.pkg === p.id
  const g = state.gst ? 1.18 : 1
  const Icon = ICON[p.id]
  const shown = open ? p.feats : p.feats.slice(0, 5)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <Item className={p.rec ? 'lg:-mt-5 lg:mb-5' : ''}>
      <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="h-full">
        <div className={`group relative h-full rounded-[30px] p-px transition-shadow duration-300 ${p.rec ? 'bg-linear-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-2xl shadow-indigo-500/25' : 'bg-line'} ${sel ? 'ring-2 ring-brand ring-offset-4 ring-offset-bg' : ''}`}>
          {p.rec && (
            <span className="absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-amber-950 shadow-lg">
              <Sparkles size={12} /> MOST POPULAR
            </span>
          )}
          <div onMouseMove={onMove} className="relative flex h-full flex-col overflow-hidden rounded-[29px] bg-surface p-7">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,0%), color-mix(in srgb, var(--brand) 14%, transparent), transparent 45%)' }} />
            <div className="relative flex items-center gap-3">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${p.rec ? 'bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-brand/10 text-brand'}`}>
                <Icon size={22} />
              </span>
              <div>
                <h3 className="text-2xl font-extrabold leading-none tracking-tight text-ink">{p.name}</h3>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{p.sub}</span>
              </div>
            </div>
            <p className="relative mt-5 min-h-[3.2rem] text-[15px] text-ink-2">{p.tag}</p>

            <div className="relative mt-5 flex items-baseline gap-2">
              <span className="text-[2.7rem] font-extrabold leading-none tracking-tight text-ink">
                <AnimatedNumber value={p.price[state.cur] * g} format={(n) => money(n, state.cur)} />
              </span>
              <span className="text-sm font-medium text-ink-2">{state.gst ? 'incl. GST' : '+ GST'}</span>
            </div>
            <p className="relative mt-1 text-sm text-ink-2">one-time · {p.ideal}</p>

            <div className="relative my-5 flex flex-wrap gap-2">
              {[
                [Clock, `~${p.days >= 28 ? Math.round(p.days / 7) + ' weeks' : p.days + ' days'}`],
                [FileText, `${p.pages} pages`],
                [LifeBuoy, `${p.support}d support`],
              ].map(([I, t]) => {
                const Ic = I as LucideIcon
                return (
                  <span key={t as string} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink-2">
                    <Ic size={13} /> {t as string}
                  </span>
                )
              })}
            </div>

            <ul className="relative space-y-3">
              {p.head && <li className="text-sm font-bold text-ink">{p.head}</li>}
              <AnimatePresence initial={false}>
                {shown.map((f) => (
                  <motion.li key={f} layout="position" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="flex gap-3 overflow-hidden text-[14.5px] text-ink">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
                      <Check size={12} strokeWidth={3.5} />
                    </span>
                    {f}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <button onClick={() => setOpen(!open)} aria-expanded={open} className="relative mt-4 inline-flex cursor-pointer items-center gap-1.5 self-start text-sm font-bold text-brand">
              {open ? 'Show fewer' : `Show all ${p.feats.length} features`}
              <motion.span animate={{ rotate: open ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.span>
            </button>

            <div className="relative mt-auto pt-7">
              <Button
                variant={sel ? 'primary' : p.rec ? 'primary' : 'ghost'}
                className="w-full"
                size="lg"
                onClick={() => {
                  setPkg(p.id)
                  goTo('quote')
                }}
              >
                {sel ? 'Selected — customise' : `Choose ${p.name}`} <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Item>
  )
}

export default function Packages() {
  const { state, setGst, setQuizOpen, goTo } = useApp()
  return (
    <Section id="packages" title="Packages">
      <SectionHead eyebrow="Our packages" title={<>Three clear packages. Pick where you are <span className="text-gradient-brand">today.</span></>} lead="Each tier includes everything in the one before it. Start small and upgrade later — or go straight to what you need." />
      <Reveal className="mb-12 flex flex-wrap items-center gap-4">
        <Button variant="soft" size="sm" onClick={() => setQuizOpen(true)}>
          <Compass size={16} /> Not sure? Find my package
        </Button>
        <span className="flex-1" />
        <Switch checked={state.gst} onChange={setGst} label="Show prices incl. 18% GST" />
      </Reveal>
      <Stagger className="grid items-stretch gap-6 lg:grid-cols-3" gap={0.12}>
        {PACKAGES.map((p) => (
          <PackageCard key={p.id} p={p} />
        ))}
      </Stagger>
      <Reveal className="mt-10">
        <p className="text-sm text-ink-2">
          Domain and hosting are optional: we offer a bundled yearly plan in your name, or you can buy them yourself and we’ll set them up. Care plans and SEO retainers are under{' '}
          <button onClick={() => goTo('plans')} className="cursor-pointer font-semibold text-brand underline underline-offset-4">
            Payments
          </button>
          .
        </p>
      </Reveal>
    </Section>
  )
}
