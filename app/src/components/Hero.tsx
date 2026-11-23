import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Compass, Gauge, ShieldCheck, Smartphone, Search, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PACKAGES } from '../data'
import { money } from '../lib'
import { useApp } from '../store'
import { AnimatedNumber, Button, ease } from '../ui'

const WORDS = ['A', 'website', 'that']
const TRUST = [
  { i: Zap, t: 'Speed-first builds' },
  { i: Smartphone, t: 'Mobile-first design' },
  { i: Search, t: 'SEO-ready from day one' },
  { i: ShieldCheck, t: 'You own everything' },
]

export default function Hero() {
  const { goTo, setQuizOpen, state } = useApp()
  const [i, setI] = useState(1)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % 3), 3400)
    return () => clearInterval(t)
  }, [])
  const p = PACKAGES[i]
  const cur = state.cur

  return (
    <section id="top" data-title="Welcome" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#060a16] pb-24 pt-32 text-white lg:pt-36">
      {/* aurora */}
      <motion.div aria-hidden className="absolute -right-40 -top-40 -z-10 h-[560px] w-[560px] rounded-full bg-violet-600/45 blur-[130px]" animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden className="absolute -bottom-48 -left-40 -z-10 h-[520px] w-[520px] rounded-full bg-indigo-600/40 blur-[130px]" animate={{ x: [0, 60, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden className="absolute left-1/3 top-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[110px]" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="glass-dark inline-flex items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4 font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Website packages · 2026
          </motion.span>

          <h1 className="mt-7 text-balance text-[2.6rem] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.4rem]">
            {WORDS.map((w, k) => (
              <motion.span key={w} className="mr-[0.25em] inline-block" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 + k * 0.08, ease }}>
                {w}
              </motion.span>
            ))}
            <br />
            <motion.span className="text-gradient inline-block" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.38, ease }}>
              earns its keep.
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease }} className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-indigo-100/80">
            Guruva Infotech designs and builds fast, search-friendly websites for growing businesses. Pick a package, tweak it, and see your exact price and timeline in seconds. No hidden costs.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.62, ease }} className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => goTo('packages')}>
              See the 3 packages <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="light" onClick={() => setQuizOpen(true)}>
              <Compass size={18} /> Help me choose
            </Button>
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium text-indigo-100/85">
            {TRUST.map(({ i: Icon, t }) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-indigo-200">
                  <Icon size={15} />
                </span>
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* live preview card */}
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.35, ease }} className="relative mx-auto w-full max-w-md">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="glass-dark rounded-[28px] p-6 shadow-2xl shadow-indigo-950/60">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-200/80">Live estimate</span>
                <div className="flex gap-1.5">
                  {PACKAGES.map((x, k) => (
                    <button key={x.id} aria-label={`Preview ${x.name}`} onClick={() => setI(k)} className={`h-1.5 cursor-pointer rounded-full transition-all ${k === i ? 'w-7 bg-white' : 'w-1.5 bg-white/35'}`} />
                  ))}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={p.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-extrabold tracking-tight">{p.name}</h3>
                    {p.rec && <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-amber-950">POPULAR</span>}
                  </div>
                  <p className="mt-1 text-sm text-indigo-100/70">{p.ideal}</p>
                  <div className="mt-5 text-5xl font-extrabold tracking-tight">
                    <AnimatedNumber value={p.price[cur]} format={(n) => money(n, cur)} />
                  </div>
                  <p className="mt-1 text-xs text-indigo-100/60">one-time · excl. GST</p>
                  <ul className="mt-6 space-y-2.5">
                    {p.feats.slice(0, 4).map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-indigo-50/90">
                        <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" strokeWidth={3} />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-indigo-100/70">
                <span>Delivery ~{p.days >= 28 ? `${Math.round(p.days / 7)} weeks` : `${p.days} days`}</span>
                <span>{p.support} days free support</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="glass-dark absolute -top-5 left-6 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-semibold sm:flex" animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
            <Gauge size={16} className="text-emerald-300" /> LCP &lt; 2.5s target
          </motion.div>
          <motion.div className="glass-dark absolute -bottom-5 right-6 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-semibold sm:flex" animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
            <ShieldCheck size={16} className="text-violet-300" /> 90-day upgrade credit
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
