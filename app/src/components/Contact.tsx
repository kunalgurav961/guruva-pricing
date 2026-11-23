import { AnimatePresence, motion } from 'framer-motion'
import { Check, CircleAlert, MessageCircle, Printer, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { getConfig, summaryText } from '../lib'
import { useApp } from '../store'
import { Button, card, ease, Reveal, Section, SectionHead } from '../ui'

const field = 'w-full rounded-xl border border-line bg-bg px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-2/60 focus:border-brand focus:ring-4 focus:ring-brand/15'

export default function Contact() {
  const { state, quote: q } = useApp()
  const cfg = getConfig()
  const [f, setF] = useState({ name: '', company: '', email: '', phone: '', msg: '' })
  const [err, setErr] = useState('')
  const [done, setDone] = useState('')
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }))
  const summary = summaryText(q, state)

  const body = () => `Hi ${cfg.company},\n\nI'd like a proposal.\n\n${summary}\n\nName: ${f.name}\nBusiness: ${f.company}\nEmail: ${f.email}\nPhone: ${f.phone}\n\n${f.msg}`
  const valid = () => {
    let m = ''
    if (!f.name.trim()) m = 'Please enter your name.'
    else if (!f.email.trim() && !f.phone.trim()) m = 'Please add an email or phone number so we can reach you.'
    else if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) m = 'That email address doesn’t look right.'
    setErr(m)
    return !m
  }
  const copyFallback = async (msg: string) => {
    try {
      await navigator.clipboard.writeText(body())
      setDone(msg)
    } catch {
      setDone('Please copy the summary above and send it to us.')
    }
  }
  const email = (e: FormEvent) => {
    e.preventDefault()
    if (!valid()) return
    if (cfg.email) {
      location.href = `mailto:${cfg.email}?subject=${encodeURIComponent('Website proposal request — ' + q.p.name)}&body=${encodeURIComponent(body())}`
      setDone('Opening your email app… If nothing opens, use the WhatsApp button.')
    } else void copyFallback('Email isn’t configured yet, so we copied your request — please paste it into an email to us.')
  }
  const wa = () => {
    if (!valid()) return
    if (cfg.whatsapp) window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(body())}`, '_blank', 'noopener')
    else void copyFallback('WhatsApp isn’t configured yet, so we copied your request instead.')
  }

  return (
    <Section id="contact" title="Get started">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#060a16] p-7 text-white sm:p-12">
        <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-600/40 blur-[110px]" />
        <div aria-hidden className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-600/35 blur-[110px]" />
        <div aria-hidden className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="relative grid items-start gap-10 lg:grid-cols-[1fr_1.05fr]">
          <Reveal>
            <span className="inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-indigo-200">
              <span className="h-px w-8 bg-indigo-300" />
              Next step
            </span>
            <h2 className="mt-4 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              Let’s turn this into your <span className="text-gradient">free proposal.</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg text-indigo-100/80">Tell us a little about your business. We’ll reply with a tailored proposal — usually within one working day — based on the package and add-ons you selected.</p>
            <ul className="mt-8 space-y-3.5">
              {['Free 20-minute discovery call, no obligation', 'Proposal with scope, timeline and fixed price', 'Upgrade credit within 90 days'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-indigo-50">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Check size={14} strokeWidth={3.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="no-print mt-9">
              <Button variant="light" onClick={() => window.print()}>
                <Printer size={17} /> Save this page as PDF
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form onSubmit={email} noValidate className={`${card} p-6 text-ink sm:p-7`}>
              <h3 className="text-lg font-extrabold">Your selection</h3>
              <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl bg-surface-2 p-4 font-mono text-[13px] leading-relaxed text-ink">{summary}</pre>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Name *
                  <input className={`${field} mt-1.5`} value={f.name} onChange={set('name')} autoComplete="name" />
                </label>
                <label className="block text-sm font-semibold">
                  Business
                  <input className={`${field} mt-1.5`} value={f.company} onChange={set('company')} autoComplete="organization" />
                </label>
                <label className="block text-sm font-semibold">
                  Email
                  <input type="email" className={`${field} mt-1.5`} value={f.email} onChange={set('email')} autoComplete="email" />
                </label>
                <label className="block text-sm font-semibold">
                  Phone / WhatsApp
                  <input type="tel" className={`${field} mt-1.5`} value={f.phone} onChange={set('phone')} autoComplete="tel" />
                </label>
                <label className="block text-sm font-semibold sm:col-span-2">
                  Anything we should know?
                  <textarea className={`${field} mt-1.5 min-h-24 resize-y`} placeholder="Goals, deadline, sites you like…" value={f.msg} onChange={set('msg')} />
                </label>
              </div>
              <div aria-live="polite" className="min-h-6 pt-3">
                <AnimatePresence mode="wait">
                  {err && (
                    <motion.p key="e" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
                      <CircleAlert size={16} /> {err}
                    </motion.p>
                  )}
                  {!err && done && (
                    <motion.p key="d" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ease }} className="flex items-center gap-2 text-sm font-semibold text-ok">
                      <Check size={16} /> {done}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                <Button type="submit" size="lg" className="flex-1">
                  <Send size={17} /> Send by email
                </Button>
                <Button type="button" variant="ghost" size="lg" onClick={wa}>
                  <MessageCircle size={17} /> WhatsApp
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>

      <footer className="mt-14 text-center text-sm text-ink-2">
        <p>
          © {new Date().getFullYear()} {cfg.company}. Prices are indicative estimates and confirmed in your written proposal.
        </p>
        <p className="mt-1.5 text-xs">
          Market ranges:{' '}
          {[
            ['Hostinger', 'https://www.hostinger.com/in/tutorials/website-cost'],
            ['WeblinkIndia', 'https://www.weblinkindia.net/blog/website-designing-company-cost-in-india-pricing-packages-what-you-actually-pay-in-2026'],
            ['CloudHouse', 'https://cloudhousetechnologies.com/blog/website-development-cost-2026-pricing-guide'],
          ].map(([n, h], i) => (
            <span key={n}>
              {i > 0 && ', '}
              <a href={h} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-brand">
                {n}
              </a>
            </span>
          ))}
          .
        </p>
      </footer>
    </Section>
  )
}
