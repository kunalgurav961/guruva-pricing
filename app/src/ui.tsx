import { motion, animate, useInView, useReducedMotion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { Check as CheckIcon } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useApp } from './store'

export const ease = [0.22, 1, 0.36, 1] as const

/** Fades/slides content in when it scrolls into view (or immediately in present mode). */
export function Reveal({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const { presenting } = useApp()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ duration: 0.6, delay, ease }}
      {...(presenting ? { animate: { opacity: 1, y: 0 } } : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' } })}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className = '', gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  const { presenting } = useApp()
  return (
    <motion.div
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      initial="hidden"
      {...(presenting ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '-60px' } })}
    >
      {children}
    </motion.div>
  )
}
export function Item({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}>
      {children}
    </motion.div>
  )
}

/** Tweens between numeric values (prices, totals) instead of snapping. */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  const reduce = useReducedMotion()
  const fmt = useRef(format)
  fmt.current = format
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduce || prev.current === value) {
      node.textContent = fmt.current(value)
      prev.current = value
      return
    }
    const c = animate(prev.current, value, { duration: 0.7, ease, onUpdate: (v) => (node.textContent = fmt.current(v)) })
    prev.current = value
    return () => c.stop()
  }, [value, reduce])
  return <span ref={ref}>{format(value)}</span>
}

/** Counts up from 0 when scrolled into view. */
export function CountUp({ to, dec = 0, suffix = '', prefix = '' }: { to: number; dec?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const { presenting } = useApp()
  const reduce = useReducedMotion()
  const go = inView || presenting
  useEffect(() => {
    const n = ref.current
    if (!n) return
    if (!go) {
      n.textContent = `${prefix}${(0).toFixed(dec)}${suffix}`
      return
    }
    if (reduce) {
      n.textContent = `${prefix}${to.toFixed(dec)}${suffix}`
      return
    }
    const c = animate(0, to, { duration: 1.4, ease, onUpdate: (v) => (n.textContent = `${prefix}${v.toFixed(dec)}${suffix}`) })
    return () => c.stop()
  }, [go, to, dec, prefix, suffix, reduce])
  return <span ref={ref}>{`${prefix}${(0).toFixed(dec)}${suffix}`}</span>
}

type BtnProps = HTMLMotionProps<'button'> & { variant?: 'primary' | 'ghost' | 'soft' | 'light'; size?: 'sm' | 'md' | 'lg' }
const BTN_BASE = 'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-xl font-semibold transition-[box-shadow,background-color,border-color] duration-200 disabled:cursor-not-allowed disabled:opacity-50'
const BTN_VAR = {
  primary: 'bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/45',
  ghost: 'border border-line bg-transparent text-ink hover:bg-surface-2',
  soft: 'bg-brand/10 text-brand hover:bg-brand/15',
  light: 'border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20',
}
const BTN_SIZE = { sm: 'h-10 px-4 text-sm', md: 'h-11 px-5 text-[15px]', lg: 'h-14 px-7 text-base' }
export function Button({ variant = 'primary', size = 'md', className = '', ...p }: BtnProps) {
  return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className={`${BTN_BASE} ${BTN_VAR[variant]} ${BTN_SIZE[size]} ${className}`} {...p} />
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  size = 'md',
  className = '',
}: {
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  layoutId: string
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <div role="group" className={`relative inline-flex rounded-xl bg-surface-2 p-1 ${className}`}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`relative z-0 cursor-pointer rounded-lg px-3.5 font-semibold transition-colors ${size === 'sm' ? 'py-1.5 text-[13px]' : 'py-2 text-sm'} ${on ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
          >
            {on && <motion.span layoutId={layoutId} className="absolute inset-0 -z-10 rounded-lg bg-surface shadow-sm ring-1 ring-line" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-brand' : 'bg-line'}`}>
        <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 34 }} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${checked ? 'right-0.5' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  )
}

/** Visual-only checkbox mark; the surrounding element owns the interaction. */
export function CheckMark({ on, locked }: { on: boolean; locked?: boolean }) {
  return (
    <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-colors ${on ? 'border-brand bg-brand text-white dark:text-[#060a16]' : 'border-line bg-surface'} ${locked ? 'opacity-70' : ''}`}>
      <AnimatePresence>
        {on && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 28 }}>
            <CheckIcon size={14} strokeWidth={3.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export function Section({ id, title, alt = false, children }: { id: string; title: string; alt?: boolean; children: ReactNode }) {
  return (
    <section id={id} data-title={title} className={`relative scroll-mt-20 py-20 sm:py-28 ${alt ? 'border-y border-line/70 bg-surface/60' : ''}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, lead, center = false }: { eyebrow: string; title: ReactNode; lead?: ReactNode; center?: boolean }) {
  return (
    <Reveal className={`mb-12 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <span className="mb-4 inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand">
        <span className="h-px w-8 bg-brand" />
        {eyebrow}
      </span>
      <h2 className="text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-[3.1rem]">{title}</h2>
      {lead && <p className="mt-5 text-pretty text-lg text-ink-2">{lead}</p>}
    </Reveal>
  )
}

export const card = 'rounded-3xl border border-line bg-surface shadow-[0_18px_50px_-28px_rgba(20,28,70,0.35)]'
