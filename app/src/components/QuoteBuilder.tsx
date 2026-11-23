import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Clock, Copy, Minus, Percent, Plus, Receipt } from 'lucide-react'
import { useState } from 'react'
import { ADDONS, PACKAGES, RECUR, type Addon, type Recur } from '../data'
import { deliveryLabel, money, recPrice, summaryText } from '../lib'
import { useApp } from '../store'
import { AnimatedNumber, Button, card, CheckMark, ease, Reveal, Section, SectionHead, Segmented, Switch } from '../ui'

const rowCls = (on: boolean) => `flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-200 ${on ? 'border-brand/60 bg-brand/[0.06]' : 'border-line bg-surface hover:border-brand/30'}`

function AddonRow({ a }: { a: Addon }) {
  const { state, setAdd, bumpAdd } = useApp()
  const included = a.inc?.includes(state.pkg)
  const v = state.add[a.id] || 0
  const on = !!included || v > 0
  const price = included ? 'Included' : `${money(a.price[state.cur], state.cur)}${a.per ? ` / ${a.per}` : ''}`
  const info = (
    <div className="min-w-0 flex-1">
      <div className="font-bold text-ink">{a.name}</div>
      <div className="text-sm text-ink-2">{a.desc}</div>
    </div>
  )
  const priceEl = <div className={`shrink-0 text-right font-mono text-sm font-semibold ${included ? 'text-ok' : 'text-ink'}`}>{price}</div>

  if (a.step && !included) {
    return (
      <div className={rowCls(on)}>
        <div className="flex shrink-0 items-center gap-1.5">
          <button aria-label={`Fewer ${a.name}`} onClick={() => bumpAdd(a.id, -1)} className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-line bg-surface text-ink transition-colors hover:bg-surface-2">
            <Minus size={16} />
          </button>
          <output className="w-8 text-center font-mono text-base font-bold text-ink">{v}</output>
          <button aria-label={`More ${a.name}`} onClick={() => bumpAdd(a.id, 1)} className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-line bg-surface text-ink transition-colors hover:bg-surface-2">
            <Plus size={16} />
          </button>
        </div>
        {info}
        {priceEl}
      </div>
    )
  }
  return (
    <div role="checkbox" aria-checked={on} aria-disabled={!!included} tabIndex={included ? -1 : 0} onClick={() => !included && setAdd(a.id, v ? 0 : 1)} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !included && (e.preventDefault(), setAdd(a.id, v ? 0 : 1))} className={`${rowCls(on)} ${included ? 'cursor-default' : 'cursor-pointer'}`}>
      <CheckMark on={on} locked={!!included} />
      {info}
      {priceEl}
    </div>
  )
}

function RecurRow({ r }: { r: Recur }) {
  const { state, toggleRec } = useApp()
  const on = !!state.rec[r.id]
  const note = r.inc?.[state.pkg]
  return (
    <div role="checkbox" aria-checked={on} tabIndex={0} onClick={() => toggleRec(r.id)} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggleRec(r.id))} className={`${rowCls(on)} cursor-pointer`}>
      <CheckMark on={on} />
      <div className="min-w-0 flex-1">
        <div className="font-bold text-ink">{r.name}</div>
        <div className="text-sm text-ink-2">
          {r.desc}
          {note && <span className="ml-1.5 rounded-md bg-ok/15 px-1.5 py-0.5 text-xs font-bold text-ok">{note}</span>}
        </div>
      </div>
      <div className="shrink-0 text-right font-mono text-sm font-semibold text-ink">
        {money(recPrice(r, state.pkg, state.cur), state.cur)}
        <span className="text-ink-2">/{r.per}</span>
      </div>
    </div>
  )
}

function Summary() {
  const { state, quote: q, setGst, setEarly, goTo } = useApp()
  const [copied, setCopied] = useState(false)
  const cur = state.cur
  const fmt = (n: number) => money(n, cur)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText(q, state))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }
  const split: [string, number][] = [
    ['On start', 0.5],
    ['Design approved', 0.3],
    ['Before go-live', 0.2],
  ]
  return (
    <aside className={`${card} p-6 lg:sticky lg:top-24`} aria-live="polite">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
          <Receipt size={18} className="text-brand" /> Your estimate
        </h3>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{q.p.name}</span>
      </div>

      <div className="mt-4">
        <AnimatePresence initial={false}>
          {q.items.map((i) => (
            <motion.div key={i.n} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease }} className="overflow-hidden">
              <div className="flex justify-between gap-3 border-b border-dashed border-line py-2.5 text-sm">
                <span className="text-ink-2">{i.n}</span>
                <span className={`font-mono font-semibold ${i.free ? 'text-ok' : 'text-ink'}`}>{i.free ? 'Free' : fmt(i.v)}</span>
              </div>
            </motion.div>
          ))}
          {q.disc > 0 && (
            <motion.div key="disc" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex justify-between gap-3 border-b border-dashed border-line py-2.5 text-sm">
                <span className="text-ink-2">Early-pay discount (5%)</span>
                <span className="font-mono font-semibold text-ok">−{fmt(q.disc)}</span>
              </div>
            </motion.div>
          )}
          {state.gst && (
            <motion.div key="gst" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex justify-between gap-3 border-b border-dashed border-line py-2.5 text-sm">
                <span className="text-ink-2">GST (18%)</span>
                <span className="font-mono font-semibold text-ink">{fmt(q.gst)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm font-semibold text-ink-2">Project total</span>
        <span className="text-4xl font-extrabold tracking-tight text-ink">
          <AnimatedNumber value={q.total} format={fmt} />
        </span>
      </div>

      <div className="mt-4 flex flex-col items-start gap-3">
        <Switch checked={state.gst} onChange={setGst} label="Include 18% GST" />
        <Switch checked={state.early} onChange={setEarly} label={<span className="inline-flex items-center gap-1.5">Pay in full upfront <span className="rounded-md bg-ok/15 px-1.5 py-0.5 text-xs font-bold text-ok">5% off</span></span>} />
      </div>

      <div className={`mt-5 grid gap-2 ${state.early ? 'grid-cols-1' : 'grid-cols-3'}`}>
        {state.early ? (
          <div className="rounded-2xl bg-surface-2 p-3 text-center">
            <div className="font-mono text-base font-bold text-ink">{fmt(q.total)}</div>
            <div className="text-xs text-ink-2">Paid once, upfront (100%)</div>
          </div>
        ) : (
          split.map(([l, s]) => (
            <div key={l} className="rounded-2xl bg-surface-2 p-3 text-center">
              <div className="font-mono text-sm font-bold text-ink">{fmt(q.total * s)}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-ink-2">
                {l} ({s * 100}%)
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence initial={false}>
        {q.rec.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-5 rounded-2xl border border-line p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                <Percent size={15} className="text-brand" /> After launch (recurring)
              </div>
              {q.rec.map((r) => (
                <div key={r.id} className="flex justify-between gap-3 py-1 text-sm">
                  <span className="text-ink-2">{r.n}</span>
                  <span className="font-mono font-semibold text-ink">
                    {fmt(r.v * q.g)}/{r.per}
                  </span>
                </div>
              ))}
              {q.monthly > 0 && (
                <div className="mt-1 flex justify-between border-t border-line pt-2 text-sm font-bold text-ink">
                  <span>Monthly total</span>
                  <span className="font-mono">{fmt(q.monthly)}/mo</span>
                </div>
              )}
              {q.yearly > 0 && (
                <div className="flex justify-between pt-1 text-sm font-bold text-ink">
                  <span>Yearly total</span>
                  <span className="font-mono">{fmt(q.yearly)}/yr</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-ink-2">
            <Clock size={15} /> Estimated delivery
          </span>
          <b className="text-ink">{deliveryLabel(q.days)}</b>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <motion.div className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500" animate={{ width: `${Math.min(100, (q.days / 70) * 100)}%` }} transition={{ duration: 0.6, ease }} />
        </div>
        <p className="mt-2 text-xs text-ink-2">Starts once content and approvals are in place.</p>
      </div>

      <div className="mt-6 flex gap-2">
        <Button className="flex-1" onClick={() => goTo('contact')}>
          Request this proposal <ArrowRight size={16} />
        </Button>
        <Button variant="ghost" aria-label="Copy estimate" onClick={copy} className="w-12 shrink-0 px-0">
          {copied ? <Check size={18} className="text-ok" /> : <Copy size={18} />}
        </Button>
      </div>
    </aside>
  )
}

export default function QuoteBuilder() {
  const { state, setPkg } = useApp()
  return (
    <Section id="quote" title="Build your quote">
      <SectionHead eyebrow="Interactive quote" title={<>Build your exact price in <span className="text-gradient-brand">30 seconds.</span></>} lead="Choose a package, add what you need, and watch the total and timeline update live. Anything already included in your package is shown as “Included”." />
      <div className="grid items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <Segmented layoutId="quote-pkg" value={state.pkg} onChange={setPkg} options={PACKAGES.map((p) => ({ value: p.id, label: p.name }))} className="mb-6" />
          <div className="space-y-3">
            {ADDONS.map((a) => (
              <AddonRow key={a.id + state.pkg} a={a} />
            ))}
          </div>
          <h4 className="mb-3 mt-9 font-mono text-xs font-medium uppercase tracking-[0.16em] text-brand">Recurring plans · billed after launch</h4>
          <div className="space-y-3">
            {RECUR.map((r) => (
              <RecurRow key={r.id + state.pkg} r={r} />
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Summary />
        </Reveal>
      </div>
    </Section>
  )
}
