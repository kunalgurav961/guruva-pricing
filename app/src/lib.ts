import { ADDONS, EARLY, PACKAGES, RECUR, type Cur, type PkgId } from './data'

export interface QuoteState {
  cur: Cur
  pkg: PkgId
  gst: boolean
  early: boolean
  add: Record<string, number>
  rec: Record<string, boolean>
}

export interface Line {
  n: string
  v: number
  free?: boolean
}
export interface RecLine {
  id: string
  n: string
  v: number
  per: 'mo' | 'yr'
}

export const money = (n: number, cur: Cur) =>
  cur === 'INR' ? '₹' + Math.round(n).toLocaleString('en-IN') : '$' + Math.round(n).toLocaleString('en-US')

export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

export function recPrice(r: (typeof RECUR)[number], pkg: PkgId, cur: Cur) {
  return (r.flat ?? r.byPkg![pkg])[cur]
}

export function calcQuote(s: QuoteState) {
  const p = PACKAGES.find((x) => x.id === s.pkg)!
  const items: Line[] = [{ n: `${p.name} package`, v: p.price[s.cur] }]
  let days = p.days
  for (const a of ADDONS) {
    const q = s.add[a.id] || 0
    if (!q || a.inc?.includes(p.id)) continue
    const m = a.step ? q : 1
    items.push({ n: a.step ? `${a.name} × ${q}` : a.name, v: a.price[s.cur] * m })
    days += a.days * m
  }
  if (p.id !== 'basic') items.push({ n: `SEO audit (free with ${p.name})`, v: 0, free: true })
  const gross = items.reduce((t, i) => t + i.v, 0)
  const disc = s.early ? gross * EARLY : 0
  const sub = gross - disc
  const gst = s.gst ? sub * 0.18 : 0
  const g = s.gst ? 1.18 : 1
  const rec: RecLine[] = RECUR.filter((r) => s.rec[r.id]).map((r) => ({
    id: r.id,
    n: r.name + (r.inc?.[p.id] ? ` (${r.inc[p.id]})` : ''),
    v: recPrice(r, p.id, s.cur),
    per: r.per,
  }))
  const monthly = rec.filter((r) => r.per === 'mo').reduce((t, r) => t + r.v, 0) * g
  const yearly = rec.filter((r) => r.per === 'yr').reduce((t, r) => t + r.v, 0) * g
  return { p, items, gross, disc, sub, gst, g, total: sub + gst, days: Math.round(days), rec, monthly, yearly }
}
export type Quote = ReturnType<typeof calcQuote>

export const deliveryLabel = (days: number) => (days >= 28 ? `~${Math.round(days / 7)} weeks` : `~${days} working days`)

export function summaryText(q: Quote, s: QuoteState) {
  const L: string[] = [`Package: ${q.p.name} (${q.p.sub})`]
  q.items.slice(1).forEach((i) => L.push(`+ ${i.n}`))
  if (q.disc) L.push(`Early-pay discount (5%): -${money(q.disc, s.cur)} (full payment upfront)`)
  L.push(`Project estimate: ${money(q.total, s.cur)} ${s.gst ? 'incl.' : 'excl.'} GST`)
  q.rec.forEach((r) => L.push(`Recurring: ${r.n} — ${money(r.v * q.g, s.cur)}/${r.per}`))
  L.push(`Delivery: ${deliveryLabel(q.days)}`)
  return L.join('\n')
}

interface Config {
  company: string
  email: string
  whatsapp: string
  usdPerInr: number
}
export function getConfig(): Config {
  const c = (window as unknown as { GURUVA_CONFIG?: Partial<Config> }).GURUVA_CONFIG ?? {}
  return { company: c.company || 'Guruva Infotech', email: c.email || '', whatsapp: c.whatsapp || '', usdPerInr: c.usdPerInr || 85 }
}
