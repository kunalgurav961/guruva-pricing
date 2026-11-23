import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PACKAGES, QUIZ } from '../data'
import { money } from '../lib'
import { useApp } from '../store'
import { Button, ease } from '../ui'

export default function Quiz() {
  const { quizOpen, setQuizOpen, setPkg, goTo, state } = useApp()
  const [step, setStep] = useState(0)
  const [ans, setAns] = useState<number[]>([])

  useEffect(() => {
    if (!quizOpen) return
    setStep(0)
    setAns([])
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setQuizOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [quizOpen, setQuizOpen])

  const done = step >= QUIZ.length
  const score = done ? ((ans[0] * 1.2 + ans[1] + ans[2] * 1.2 + ans[3]) / (2 * (1.2 + 1 + 1.2 + 1))) * 100 : 0
  const p = PACKAGES[score < 32 ? 0 : score < 68 ? 1 : 2]

  const pick = (i: number) => {
    setAns((a) => [...a.slice(0, step), i])
    setStep((s) => s + 1)
  }

  return (
    <AnimatePresence>
      {quizOpen && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[#060a16]/70 backdrop-blur-sm" onClick={() => setQuizOpen(false)} />
          <motion.div role="dialog" aria-modal="true" aria-label="Find your best-fit package" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.35, ease }} className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-line bg-surface p-7 shadow-2xl">
            <button aria-label="Close" onClick={() => setQuizOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink">
              <X size={18} />
            </button>
            <div className="mb-6 flex gap-1.5 pr-10">
              {QUIZ.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <motion.div className="h-full bg-linear-to-r from-indigo-500 to-violet-500" animate={{ width: i < step ? '100%' : '0%' }} transition={{ duration: 0.4, ease }} />
                </div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28, ease }}>
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-brand">
                    Question {step + 1} of {QUIZ.length}
                  </span>
                  <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-ink">{QUIZ[step].q}</h3>
                  <div className="mt-6 space-y-3">
                    {QUIZ[step].o.map((o, i) => (
                      <motion.button key={o} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => pick(i)} className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left font-semibold transition-colors ${ans[step] === i ? 'border-brand bg-brand/10 text-ink' : 'border-line text-ink hover:border-brand/50 hover:bg-surface-2'}`}>
                        {o}
                        <ArrowRight size={16} className="shrink-0 text-ink-2" />
                      </motion.button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button onClick={() => setStep(step - 1)} className="mt-5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-ink">
                      <ArrowLeft size={15} /> Back
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div key="res" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }}>
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-brand">Your best match</span>
                  <h3 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">
                    {p.name} <span className="text-lg font-semibold text-ink-2">· {p.sub}</span>
                  </h3>
                  <p className="mt-3 text-ink-2">{p.tag}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[money(p.price[state.cur], state.cur), `~${p.days >= 28 ? Math.round(p.days / 7) + ' weeks' : p.days + ' days'}`, `${p.pages} pages`].map((t) => (
                      <span key={t} className="rounded-full bg-surface-2 px-3.5 py-1.5 text-sm font-bold text-ink">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={() => {
                        setPkg(p.id)
                        setQuizOpen(false)
                        goTo('quote')
                      }}
                    >
                      Use {p.name} <ArrowRight size={18} />
                    </Button>
                    <Button variant="ghost" size="lg" onClick={() => (setStep(0), setAns([]))}>
                      Retake
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
