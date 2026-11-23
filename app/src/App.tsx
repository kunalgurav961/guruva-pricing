import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, type ComponentType } from 'react'
import Compare from './components/Compare'
import Contact from './components/Contact'
import Faq from './components/Faq'
import Header from './components/Header'
import Hero from './components/Hero'
import Packages from './components/Packages'
import Payments from './components/Payments'
import Process from './components/Process'
import Quiz from './components/Quiz'
import QuoteBuilder from './components/QuoteBuilder'
import ROI from './components/ROI'
import Why from './components/Why'
import { SECTION_IDS } from './data'
import { useApp } from './store'
import { ease } from './ui'

const SECTIONS: Record<(typeof SECTION_IDS)[number], ComponentType> = {
  top: Hero,
  why: Why,
  packages: Packages,
  compare: Compare,
  quote: QuoteBuilder,
  plans: Payments,
  roi: ROI,
  process: Process,
  faq: Faq,
  contact: Contact,
}
const TITLES = ['Welcome', 'Why it matters', 'Packages', 'Compare', 'Build your quote', 'Payments & plans', 'ROI', 'How we work', 'FAQ', 'Get started']

function Presenter() {
  const { slide, dir, setSlide, stopPresenting } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  const Slide = SECTIONS[SECTION_IDS[slide]]

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
  }, [slide])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches?.('input,textarea,select')) return
      if (['ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && e.target === document.body)) (e.preventDefault(), setSlide(slide + 1))
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) (e.preventDefault(), setSlide(slide - 1))
      else if (e.key === 'Escape') stopPresenting()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slide, setSlide, stopPresenting])

  return (
    <div className="fixed inset-0 z-40 bg-bg">
      <div ref={ref} className="h-full overflow-y-auto overflow-x-hidden pb-24">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div key={slide} custom={dir} variants={{ enter: (d: number) => ({ opacity: 0, x: 80 * d }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -80 * d }) }} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease }}>
            <Slide />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="glass fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(520px,calc(100%-24px))] items-center gap-3 rounded-2xl px-3 py-2.5 shadow-xl">
        <button aria-label="Previous slide" disabled={slide === 0} onClick={() => setSlide(slide - 1)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-line text-ink transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between text-xs">
            <span className="truncate font-bold text-ink">{TITLES[slide]}</span>
            <span className="font-mono text-ink-2">
              {slide + 1}/{SECTION_IDS.length}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <motion.div className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500" animate={{ width: `${((slide + 1) / SECTION_IDS.length) * 100}%` }} transition={{ duration: 0.4, ease }} />
          </div>
        </div>
        <button aria-label="Next slide" disabled={slide === SECTION_IDS.length - 1} onClick={() => setSlide(slide + 1)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-line text-ink transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const { presenting } = useApp()
  return (
    <div className="noscroll-x min-h-screen">
      <Header />
      {presenting ? (
        <Presenter />
      ) : (
        <main>
          {SECTION_IDS.map((id) => {
            const C = SECTIONS[id]
            return <C key={id} />
          })}
        </main>
      )}
      <Quiz />
    </div>
  )
}
