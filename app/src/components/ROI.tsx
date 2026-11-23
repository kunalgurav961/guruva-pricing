import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { getConfig, inr, money } from '../lib'
import { useApp } from '../store'
import { AnimatedNumber, card, ease, Reveal, Section, SectionHead } from '../ui'

function Slider({ id, label, value, min, max, step, onChange, display }: { id: string; label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; display: string }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-7 last:mb-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-bold text-ink">
          {label}
        </label>
        <output className="rounded-lg bg-brand/10 px-2.5 py-1 font-mono text-sm font-semibold text-brand">{display}</output>
      </div>
      <input id={id} type="range" className="range" min={min} max={max} step={step} value={value} style={{ ['--pct' as string]: `${pct}%` }} onChange={(e) => onChange(+e.target.value)} />
    </div>
  )
}

export default function ROI() {
  const { quote: q, state } = useApp()
  const [vis, setVis] = useState(1500)
  const [conv, setConv] = useState(1)
  const [val, setVal] = useState(8000)
  const [up, setUp] = useState(20)

  const now = (vis * conv) / 100
  const next = now * (1 + up / 100)
  const extra = (next - now) * val
  const invINR = state.cur === 'INR' ? q.total : q.total * getConfig().usdPerInr
  const pay = extra > 0 ? invINR / extra : Infinity
  const barMax = Math.max(next, 1)

  return (
    <Section id="roi" title="ROI">
      <SectionHead eyebrow="Return on investment" title={<>What could a better site be <span className="text-gradient-brand">worth to you?</span></>} lead="Move the sliders with your own numbers. The uplift is an assumption you control — we suggest staying conservative." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className={`${card} p-7`}>
            <Slider id="rVis" label="Monthly website visitors" value={vis} min={200} max={50000} step={100} onChange={setVis} display={vis.toLocaleString('en-IN')} />
            <Slider id="rConv" label="Current conversion rate" value={conv} min={0.2} max={6} step={0.1} onChange={setConv} display={`${conv.toFixed(1)}%`} />
            <Slider id="rVal" label="Average value of one customer" value={val} min={500} max={200000} step={500} onChange={setVal} display={inr(val)} />
            <Slider id="rUp" label="Expected conversion uplift" value={up} min={5} max={100} step={5} onChange={setUp} display={`+${up}%`} />
            <p className="mt-6 text-xs text-ink-2">Customer value is in rupees regardless of the currency toggle.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 to-violet-700 p-7 text-white">
              <div aria-hidden className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
              <div className="relative flex items-center gap-2 text-sm font-semibold text-indigo-100">
                <TrendingUp size={16} /> Extra revenue per month
              </div>
              <div className="relative mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
                <AnimatedNumber value={extra} format={inr} />
              </div>
            </div>

            <div className={`${card} p-6`}>
              {[
                ['Customers / month now', now, 'bg-ink-2/50'],
                ['With your new site', next, 'bg-linear-to-r from-indigo-500 to-violet-500'],
              ].map(([l, v, c]) => (
                <div key={l as string} className="mb-5 last:mb-0">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold text-ink-2">{l as string}</span>
                    <b className="font-mono text-ink">{(v as number).toFixed(1)}</b>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-2">
                    <motion.div className={`h-full rounded-full ${c as string}`} animate={{ width: `${((v as number) / barMax) * 100}%` }} transition={{ duration: 0.6, ease }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`${card} p-5`}>
                <div className="text-sm font-semibold text-ink-2">Your {q.p.name} estimate</div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{money(q.total, state.cur)}</div>
              </div>
              <div className={`${card} p-5`}>
                <div className="text-sm font-semibold text-ink-2">Estimated payback</div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{isFinite(pay) ? (pay < 1 ? '< 1 month' : `${pay.toFixed(1)} months`) : '—'}</div>
              </div>
            </div>
            <p className="text-xs text-ink-2">Illustrative maths only: visitors × conversion rate × customer value. Real results depend on traffic quality, offer and follow-up.</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
