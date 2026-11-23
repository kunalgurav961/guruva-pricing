import { AnimatePresence, motion } from 'framer-motion'
import { Check, Code2, Compass, LifeBuoy, Palette, Rocket, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { PACKAGES, STEPS } from '../data'
import { useApp } from '../store'
import { card, ease, Reveal, Section, SectionHead } from '../ui'

const ICONS: LucideIcon[] = [Compass, Palette, Code2, Rocket, LifeBuoy]

export default function Process() {
  const { state } = useApp()
  const [idx, setIdx] = useState(0)
  const pi = PACKAGES.findIndex((p) => p.id === state.pkg)
  const s = STEPS[idx]
  const d = s.d[pi]
  const Icon = ICONS[idx]

  return (
    <Section id="process" title="How we work">
      <SectionHead eyebrow="How we work" title={<>A simple, transparent <span className="text-gradient-brand">5-step process.</span></>} lead="Click a step to see what you get. Timings adjust to the package you selected." />
      <Reveal>
        <div role="tablist" aria-label="Process steps" className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STEPS.map((x, i) => {
            const on = i === idx
            const I = ICONS[i]
            return (
              <button key={x.n} role="tab" aria-selected={on} onClick={() => setIdx(i)} className={`relative cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition-colors ${on ? 'border-brand/60 bg-brand/[0.07]' : 'border-line bg-surface hover:border-brand/30'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-medium tracking-[0.16em] text-brand">STEP {x.n}</span>
                  <I size={16} className={on ? 'text-brand' : 'text-ink-2'} />
                </div>
                <div className="mt-2 font-bold text-ink">{x.t}</div>
                {on && <motion.span layoutId="step-bar" className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-indigo-500 to-violet-500" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              </button>
            )
          })}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-5">
        <div className={`${card} overflow-hidden p-7 sm:p-9`}>
          <AnimatePresence mode="wait">
            <motion.div key={idx} role="tabpanel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3, ease }} className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
                  <Icon size={26} />
                </span>
                <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
                  {s.n} · {s.t}
                </h3>
                <p className="mt-3 max-w-lg text-ink-2">{s.blurb}</p>
                <span className="mt-5 inline-flex rounded-full bg-brand/10 px-3.5 py-1.5 text-sm font-bold text-brand">
                  ≈ {d} working day{d > 1 ? 's' : ''} on {state.pkg === 'adv' ? 'Advanced' : state.pkg === 'pro' ? 'Pro' : 'Basic'}
                </span>
              </div>
              <div>
                <h4 className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink-2">You receive</h4>
                <ul className="mt-4 space-y-3">
                  {s.out.map((o, k) => (
                    <motion.li key={o} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + k * 0.07, ease }} className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 text-sm font-semibold text-ink">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-ok/15 text-ok">
                        <Check size={14} strokeWidth={3.5} />
                      </span>
                      {o}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  )
}
