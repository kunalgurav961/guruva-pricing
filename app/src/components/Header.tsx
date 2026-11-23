import { motion, useScroll, useSpring } from 'framer-motion'
import { Moon, Play, Square, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NAV, SECTION_IDS } from '../data'
import { useApp } from '../store'
import { Button, Segmented } from '../ui'

export default function Header() {
  const { state, setCur, theme, toggleTheme, presenting, startPresenting, stopPresenting, goTo, slide } = useApp()
  const [seen, setSeen] = useState('top')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })

  useEffect(() => {
    if (presenting) return
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setSeen(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [presenting])

  const current = presenting ? SECTION_IDS[slide] : seen

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      {!presenting && <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 h-[3px] origin-left bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400" />}
      <div className="glass mx-auto flex max-w-6xl items-center gap-2 rounded-2xl px-3 py-2 shadow-lg shadow-black/5 sm:gap-3">
        <button onClick={() => goTo('top')} className="flex cursor-pointer items-center gap-2.5 pr-1" aria-label="Guruva Infotech home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-[17px] font-extrabold text-white shadow-md shadow-indigo-600/40">G</span>
          <span className="hidden text-[15px] font-extrabold tracking-tight text-ink sm:block">
            Guruva <span className="font-medium text-ink-2">Infotech</span>
          </span>
        </button>

        <nav className="ml-2 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Sections">
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => goTo(id)} className={`relative cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${current === id ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}>
              {current === id && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-lg bg-surface-2" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              {label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Segmented
            size="sm"
            layoutId="cur-pill"
            value={state.cur}
            onChange={setCur}
            options={[
              { value: 'INR', label: '₹ INR' },
              { value: 'USD', label: '$ USD' },
            ]}
          />
          <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-line text-ink transition-colors hover:bg-surface-2">
            <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.span>
          </button>
          <Button size="sm" onClick={presenting ? stopPresenting : startPresenting} aria-label={presenting ? 'Exit presentation' : 'Start presentation'}>
            {presenting ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            <span className="hidden sm:inline">{presenting ? 'Exit' : 'Present'}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
