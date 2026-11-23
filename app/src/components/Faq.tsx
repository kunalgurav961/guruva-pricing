import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { FAQ } from '../data'
import { card, ease, Reveal, Section, SectionHead } from '../ui'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq" title="FAQ" alt>
      <div className="mx-auto max-w-3xl">
        <SectionHead eyebrow="Good questions" title={<>Frequently <span className="text-gradient-brand">asked.</span></>} />
        <div className="space-y-3">
          {FAQ.map(([q, a], i) => {
            const on = open === i
            return (
              <Reveal key={q} delay={i * 0.03}>
                <div className={`${card} overflow-hidden transition-colors ${on ? 'border-brand/50' : ''}`}>
                  <button id={`faq-${i}`} aria-expanded={on} aria-controls={`faq-p-${i}`} onClick={() => setOpen(on ? null : i)} className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="font-bold text-ink">{q}</span>
                    <motion.span animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.25 }} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${on ? 'bg-brand text-white dark:text-[#060a16]' : 'bg-surface-2 text-ink'}`}>
                      <Plus size={16} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                        <p className="px-6 pb-6 leading-relaxed text-ink-2">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
