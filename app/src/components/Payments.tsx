import { motion } from 'framer-motion'
import { Ban, BadgePercent, Check, FileCheck2, Gift, Hourglass, KeyRound, Receipt, RefreshCw } from 'lucide-react'
import { AUDIT, HOURLY, PACKAGES, RECUR } from '../data'
import { money, recPrice } from '../lib'
import { useApp } from '../store'
import { AnimatedNumber, Button, card, ease, Item, Reveal, Section, SectionHead, Stagger } from '../ui'

const STEPS = [
  { p: 0.5, t: 'On start', d: 'Kicks off discovery and design' },
  { p: 0.3, t: 'Design approved', d: 'Development begins' },
  { p: 0.2, t: 'Before go-live', d: 'Final files and access handed over' },
]

export default function Payments() {
  const { state, quote: q, setEarly, goTo } = useApp()
  const cur = state.cur
  const g = q.g
  const sel = PACKAGES.findIndex((p) => p.id === state.pkg)
  const fmt = (n: number) => money(n, cur)
  const policies = [
    { i: RefreshCw, t: 'Revisions', d: `Each package has fixed revision rounds (2, 3 or 4). Extra changes are billed at ${fmt(HOURLY[cur])} per hour and quoted before we start.` },
    { i: Ban, t: 'Cancellation', d: 'The 50% start payment covers discovery and design work and is non-refundable. Any milestone already delivered is billed.' },
    { i: KeyRound, t: 'Ownership & handover', d: 'You own the code, design files and content. Everything is handed over once the final payment is received.' },
    { i: FileCheck2, t: 'Upgrade credit', d: 'Move up to a bigger package within 90 days and pay only the price difference.' },
    { i: Gift, t: 'Free with Pro & Advanced', d: `A free SEO audit (worth ${fmt(AUDIT[cur])}). Advanced also includes your first 3 months of care plan.` },
    { i: Hourglass, t: 'Timelines', d: 'Delivery estimates start once content and approvals are in place. The clock pauses while we wait on your feedback.' },
  ]

  const row = (label: string, desc: string, cells: string[]) => (
    <tr className="border-t border-line/70">
      <td className="px-5 py-4 align-top">
        <div className="text-sm font-bold text-ink">{label}</div>
        <div className="mt-0.5 max-w-[260px] text-xs text-ink-2">{desc}</div>
      </td>
      {cells.map((c, i) => (
        <td key={i} className={`px-4 py-4 text-center align-middle font-mono text-sm font-semibold text-ink ${i === sel ? 'bg-brand/[0.06]' : ''}`}>
          {c}
        </td>
      ))}
    </tr>
  )

  return (
    <Section id="plans" title="Payments & plans" alt>
      <SectionHead eyebrow="Payments & plans" title={<>Simple payments. Clear terms. <span className="text-gradient-brand">Optional ongoing care.</span></>} lead="No surprises: you know what you pay, when you pay it, and what you get after launch." />

      <Reveal>
        <h3 className="mb-5 text-xl font-bold text-ink">
          How you pay for the build <span className="ml-1 text-sm font-medium text-ink-2">for your {q.p.name} estimate</span>
        </h3>
      </Reveal>

      {state.early ? (
        <Reveal>
          <div className={`${card} flex flex-wrap items-center justify-between gap-4 p-7`}>
            <div>
              <span className="rounded-full bg-ok/15 px-3 py-1 text-xs font-bold text-ok">100% upfront</span>
              <div className="mt-3 text-4xl font-extrabold tracking-tight text-ink">
                <AnimatedNumber value={q.total} format={fmt} />
              </div>
              <p className="mt-1 text-sm text-ink-2">Early-pay discount applied: you save {fmt(q.disc * g)}.</p>
            </div>
            <Button variant="ghost" onClick={() => setEarly(false)}>
              Switch back to milestones
            </Button>
          </div>
        </Reveal>
      ) : (
        <div className="relative">
          <div aria-hidden className="absolute left-[16.6%] right-[16.6%] top-[34px] hidden h-0.5 overflow-hidden rounded bg-line md:block">
            <motion.div className="h-full origin-left bg-linear-to-r from-indigo-500 to-violet-500" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease }} />
          </div>
          <Stagger className="relative grid gap-5 md:grid-cols-3">
            {STEPS.map((s, k) => (
              <Item key={s.t} className={`${card} p-6 text-center`}>
                <div className="mx-auto grid h-[68px] w-[68px] place-items-center rounded-full border-4 border-bg bg-linear-to-br from-indigo-600 to-violet-600 text-lg font-extrabold text-white shadow-lg shadow-indigo-600/30">{s.p * 100}%</div>
                <div className="mt-4 text-3xl font-extrabold tracking-tight text-ink">
                  <AnimatedNumber value={q.total * s.p} format={fmt} />
                </div>
                <h4 className="mt-1 font-bold text-ink">
                  {k + 1}. {s.t}
                </h4>
                <p className="mt-1 text-sm text-ink-2">{s.d}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      )}

      <Reveal className="mt-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 to-violet-700 p-7 text-white">
          <div aria-hidden className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
              <BadgePercent size={24} />
            </span>
            <div className="min-w-[240px] flex-1">
              <h4 className="text-lg font-extrabold">Pay in full upfront and save 5%</h4>
              <p className="text-sm text-indigo-100/85">Skip the milestones: pay the project fee once at the start and take 5% off. Recurring plans below are not discounted.</p>
            </div>
            <Button variant="light" onClick={() => (setEarly(true), goTo('quote'))} disabled={state.early}>
              {state.early ? (
                <>
                  <Check size={16} /> Applied
                </>
              ) : (
                'Apply to my quote'
              )}
            </Button>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <h3 className="flex items-center gap-2 text-xl font-bold text-ink">
          <Receipt size={20} className="text-brand" /> Optional plans after launch
        </h3>
        <p className="mb-5 mt-1 text-sm text-ink-2">
          Billed separately from the build. Add any of these in the quote builder. Prices {state.gst ? 'include' : 'exclude'} 18% GST.
        </p>
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="bg-surface-2">
                <th className="px-5 py-4" />
                {PACKAGES.map((p, i) => (
                  <th key={p.id} className={`px-4 py-4 text-center text-base font-extrabold text-ink ${i === sel ? 'bg-brand/10' : ''}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row(`${RECUR[0].name} · per month`, RECUR[0].desc, PACKAGES.map((p) => fmt(recPrice(RECUR[0], p.id, cur) * g)))}
              {row('Care plan includes', 'What you get each month', ['Backups, security updates, uptime monitoring, 1 hr of changes', '+ 3 hrs of changes, monthly performance report', '+ 8 hrs of changes, 24h priority response, quarterly review'])}
              {row(`${RECUR[1].name} · per year`, RECUR[1].desc, PACKAGES.map((p) => fmt(recPrice(RECUR[1], p.id, cur) * g)))}
              {row(`${RECUR[2].name} · per month`, RECUR[2].desc, [0, 1, 2].map(() => fmt(recPrice(RECUR[2], 'pro', cur) * g)))}
              {row(`${RECUR[3].name} · per month`, RECUR[3].desc, [0, 1, 2].map(() => fmt(recPrice(RECUR[3], 'pro', cur) * g)))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <h3 className="mb-5 text-xl font-bold text-ink">Terms in plain English</h3>
      </Reveal>
      <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {policies.map(({ i: Icon, t, d }) => (
          <Item key={t} className={`${card} p-6 transition-transform duration-300 hover:-translate-y-1`}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 text-brand">
              <Icon size={21} />
            </span>
            <h4 className="mt-4 font-bold text-ink">{t}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{d}</p>
          </Item>
        ))}
      </Stagger>
    </Section>
  )
}
