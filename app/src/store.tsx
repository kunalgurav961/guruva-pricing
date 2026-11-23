import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SECTION_IDS, type Cur, type PkgId } from './data'
import { calcQuote, type Quote, type QuoteState } from './lib'

type Theme = 'light' | 'dark'

interface Ctx {
  state: QuoteState
  quote: Quote
  setCur: (c: Cur) => void
  setPkg: (p: PkgId) => void
  setGst: (v: boolean) => void
  setEarly: (v: boolean) => void
  setAdd: (id: string, n: number) => void
  bumpAdd: (id: string, d: number) => void
  toggleRec: (id: string) => void
  theme: Theme
  toggleTheme: () => void
  presenting: boolean
  startPresenting: () => void
  stopPresenting: () => void
  slide: number
  dir: number
  setSlide: (i: number) => void
  goTo: (id: string) => void
  quizOpen: boolean
  setQuizOpen: (v: boolean) => void
}

const AppCtx = createContext<Ctx | null>(null)
export const useApp = () => {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside provider')
  return c
}

const read = (k: string): string | null => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage unavailable */
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuoteState>(() => ({
    cur: read('g_cur') === 'USD' ? 'USD' : 'INR',
    pkg: 'pro',
    gst: false,
    early: false,
    add: {},
    rec: {},
  }))
  const [theme, setTheme] = useState<Theme>(() => {
    const s = read('g_theme')
    if (s === 'dark' || s === 'light') return s
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [presenting, setPresenting] = useState(false)
  const [slide, setSlideRaw] = useState(0)
  const [quizOpen, setQuizOpen] = useState(false)
  const dirRef = useRef(1)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    write('g_theme', theme)
  }, [theme])
  useEffect(() => write('g_cur', state.cur), [state.cur])

  const quote = useMemo(() => calcQuote(state), [state])

  const setSlide = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(SECTION_IDS.length - 1, i))
      dirRef.current = n >= slide ? 1 : -1
      setSlideRaw(n)
    },
    [slide],
  )

  const startPresenting = useCallback(() => {
    const mid = window.scrollY + window.innerHeight / 2
    let idx = 0
    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id)
      if (el && el.offsetTop <= mid) idx = i
    })
    dirRef.current = 1
    setSlideRaw(idx)
    setPresenting(true)
    document.documentElement.requestFullscreen?.().catch(() => undefined)
  }, [])
  const stopPresenting = useCallback(() => {
    setPresenting(false)
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined)
  }, [])

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setPresenting(false)
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const goTo = useCallback(
    (id: string) => {
      if (presenting) {
        setSlide(Math.max(0, SECTION_IDS.indexOf(id as (typeof SECTION_IDS)[number])))
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [presenting, setSlide],
  )

  const value: Ctx = {
    state,
    quote,
    setCur: (cur) => setState((s) => ({ ...s, cur })),
    setPkg: (pkg) => setState((s) => ({ ...s, pkg, add: {}, rec: {} })),
    setGst: (gst) => setState((s) => ({ ...s, gst })),
    setEarly: (early) => setState((s) => ({ ...s, early })),
    setAdd: (id, n) => setState((s) => ({ ...s, add: { ...s.add, [id]: Math.max(0, Math.min(40, n)) } })),
    bumpAdd: (id, d) => setState((s) => ({ ...s, add: { ...s.add, [id]: Math.max(0, Math.min(40, (s.add[id] || 0) + d)) } })),
    toggleRec: (id) =>
      setState((s) => {
        const on = !s.rec[id]
        const rec = { ...s.rec, [id]: on }
        if (on && id === 'seoS') rec.seoG = false
        if (on && id === 'seoG') rec.seoS = false
        return { ...s, rec }
      }),
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    presenting,
    startPresenting,
    stopPresenting,
    slide,
    dir: dirRef.current,
    setSlide,
    goTo,
    quizOpen,
    setQuizOpen,
  }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
