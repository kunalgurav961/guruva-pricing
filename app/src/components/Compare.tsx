import { motion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { MATRIX, PACKAGES, type Cell } from '../data'
import { inr, money } from '../lib'
import { useApp } from '../store'
import { card, ease, Reveal, Section, SectionHead, Switch } from '../ui'

const RANGES: [string, string, number, number][] = [
  ['Basic business site', 'Typical agency range', 10000, 25000],
  ['Dynamic / CMS site', 'Typical agency range', 25000, 60000],
  ['E-commerce site', 'Typical agency range', 50000, 150000],
  ['Custom CMS & integrations', 'Typical agency range', 150000, 600000],
]
const TICKS = [10000, 25000, 50000, 100000, 200000, 500000]
const lo = Math.log(5000)
const hi = Math.log(600000)
const pos = (v: number) => ((Math.log(v) - lo) / (hi - lo)) * 100
const tick = (v: number) => (v >= 100000 ? `${v / 100000}L` : `${v / 1000}k`)

function CellView({ v, hl }: { v: Cell; hl: boolean }) {
  return (
    <td className={`px-4 py-3.5 text-center text-sm ${hl ? 'bg-brand/[0.06]' : ''}`}>
      {v === true ? (
        <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-ok/15 text-ok">
          <Check size={14} strokeWidth={3.5} />
        </span>
      ) : v === false ? (
        <Minus size={16} className="mx-auto text-ink-2/40" />
      ) : (
        <span className="font-semibold text-ink">{v}</span>
      )}
    </td>
  )
}

function Bench() {
  const { state } = useApp()
  return (
    <div className={`${card} mt-10 p-7`}>
      <h3 className="text-xl font-bold text-ink">How our prices compare with the Indian market</h3>
      <p className="mt-1 text-sm text-ink-2">
        Grey bars are typical ranges quoted by Indian agencies for similar scope (
        <a className="font-semibold text-brand underline underline-offset-4" href="https://www.weblinkindia.net/blog/website-designing-company-cost-in-india-pricing-packages-what-you-actually-pay-in-2026" target="_blank" rel="noopener noreferrer">WeblinkIndia</a>,{' '}
        <a className="font-semibold text-brand underline underline-offset-4" href="https://cloudhousetechnologies.com/blog/website-development-cost-2026-pricing-guide" target="_blank" rel="noopener noreferrer">CloudHouse</a>
        ). Markers show where Guruva sits (INR, log scale).
      </p>
      <div className="mt-8 space-y-4">
        {RANGES.map(([label, , a, b], k) => (
          <div key={label} className="grid items-center gap-2 sm:grid-cols-[210px_1fr] sm:gap-5">
            <div className="text-sm font-semibold text-ink">
              {label}
              <span className="ml-2 font-mono text-xs font-medium text-ink-2">
                {inr(a)}–{inr(b)}
              </span>
            </div>
            <div className="relative h-7 rounded-lg bg-surface-2">
              <motion.div className="absolute inset-y-1 rounded-md bg-ink-2/40" style={{ left: `${pos(a)}%`, width: `${pos(b) - pos(a)}%`, originX: 0 }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: k * 0.1, ease }} />
            </div>
          </div>
        ))}
        <div className="grid items-center gap-2 pt-5 sm:grid-cols-[210px_1fr] sm:gap-5">
          <div className="text-sm font-extrabold text-ink">Guruva Infotech</div>
          <div className="relative h-7 rounded-lg bg-surface-2">
            {PACKAGES.map((p, k) => (
              <motion.div key={p.id} className="absolute -top-1 bottom-[-4px] w-1 -translate-x-1/2 rounded-full" style={{ left: `${pos(p.price.INR)}%`, background: p.id === state.pkg ? 'var(--gold)' : 'var(--brand)' }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 + k * 0.12, ease }}>
                <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-semibold text-ink">
                  {p.name} {inr(p.price.INR / 1000)}k
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="hidden grid-cols-[210px_1fr] gap-5 sm:grid">
          <div />
          <div className="relative h-5 font-mono text-[11px] text-ink-2">
            {TICKS.map((t) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: `${pos(t)}%` }}>
                ₹{tick(t)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Compare() {
  const { state } = useApp()
  const [diff, setDiff] = useState(false)
  const sel = PACKAGES.findIndex((p) => p.id === state.pkg)
  const g = state.gst ? 1.18 : 1
  const rows = useMemo(() => {
    const out: typeof MATRIX = []
    let pending: (typeof MATRIX)[number] | null = null
    for (const r of MATRIX) {
      if ('group' in r) {
        pending = r
        continue
      }
      if (diff && r.v.every((x) => x === r.v[0])) continue
      if (pending) {
        out.push(pending)
        pending = null
      }
      out.push(r)
    }
    return out
  }, [diff])

  return (
    <Section id="compare" title="Compare" alt>
      <SectionHead eyebrow="Side by side" title={<>Compare every <span className="text-gradient-brand">feature.</span></>} />
      <Reveal className="mb-5 flex flex-wrap items-center gap-4">
        <Switch checked={diff} onChange={setDiff} label="Show only differences" />
        <span className="text-sm text-ink-2">Your selected package is highlighted.</span>
      </Reveal>
      <Reveal>
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-10 bg-surface-2 px-5 py-5 text-left text-xs font-semibold uppercase tracking-wider text-ink-2">Feature</th>
                {PACKAGES.map((p, i) => (
                  <th key={p.id} className={`px-4 py-5 text-center ${i === sel ? 'bg-brand/[0.1]' : 'bg-surface-2'}`}>
                    <div className="text-base font-extrabold text-ink">{p.name}</div>
                    <div className="mt-0.5 font-mono text-xs font-medium text-ink-2">{money(p.price[state.cur] * g, state.cur)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, k) =>
                'group' in r ? (
                  <tr key={`g${r.group}${k}`}>
                    <td colSpan={4} className="bg-surface-2/70 px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-brand">
                      {r.group}
                    </td>
                  </tr>
                ) : (
                  <Fragment key={r.label}>
                    <tr className="group border-t border-line/70 transition-colors hover:bg-surface-2/60">
                      <td className="sticky left-0 bg-surface px-5 py-3.5 text-sm font-semibold text-ink group-hover:bg-surface-2">{r.label}</td>
                      {r.v.map((v, i) => (
                        <CellView key={i} v={v} hl={i === sel} />
                      ))}
                    </tr>
                  </Fragment>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Reveal>
      <Reveal>
        <Bench />
      </Reveal>
    </Section>
  )
}
