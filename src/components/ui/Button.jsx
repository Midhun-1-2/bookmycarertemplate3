import { useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { SPRING_SNAPPY } from '../../lib/motion'

/**
 * The template's primary control.
 *
 * Fully pill-shaped, which is the single fastest tell that this is Aurora
 * Bloom and not Editorial Ivory. Primary is a two-stop sunrise gradient with a
 * warm glow rather than a flat fill, with a cursor-tracked highlight and a
 * hairline top-edge sheen layered on top so it never reads as a flat sticker.
 * The button also leans very slightly toward the pointer.
 */

const variants = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-[0_10px_28px_-10px_rgba(242,67,26,0.75)] hover:shadow-[0_14px_36px_-8px_rgba(242,67,26,0.9)]',
  secondary:
    'bg-slate-900/[0.045] text-slate-900 border border-line hover:bg-slate-900/[0.075] hover:border-line-strong',
  outline:
    'border-2 border-brand-500/50 text-brand-700 bg-brand-500/[0.06] hover:bg-brand-500/[0.14] hover:border-brand-500',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.05]',
  danger:
    'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-[0_10px_28px_-10px_rgba(194,31,82,0.7)] hover:shadow-[0_14px_36px_-8px_rgba(194,31,82,0.85)]',
}

const sizes = {
  sm: 'h-9 px-4 text-[13px] gap-1.5 rounded-full',
  md: 'h-11 px-5.5 text-sm gap-2 rounded-full',
  lg: 'h-13 px-8 text-[15px] gap-2.5 rounded-full',
}

// Variants whose fill is dark enough that a white highlight would wash it out.
const LIGHT_SHEEN = new Set(['primary', 'danger'])

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  magnetic = true,
  ...props
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const tx = useSpring(0, { stiffness: 300, damping: 18, mass: 0.5 })
  const ty = useSpring(0, { stiffness: 300, damping: 18, mass: 0.5 })

  const highlight = useMotionTemplate`radial-gradient(120px circle at ${mx}px ${my}px, ${
    LIGHT_SHEEN.has(variant) ? 'rgba(255,255,255,0.32)' : 'rgba(242,67,26,0.14)'
  }, transparent 70%)`

  function handleMove(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
    if (magnetic && !reduce) {
      tx.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 4)
      ty.set(((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 3.4)
    }
  }

  function handleLeave() {
    mx.set(-200)
    my.set(-200)
    tx.set(0)
    ty.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: tx, y: ty }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING_SNAPPY}
      className={cn(
        'group/btn relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden font-semibold tracking-[-0.01em] transition-[background-color,border-color,box-shadow,color] duration-300 disabled:pointer-events-none disabled:opacity-45',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Cursor highlight. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
        style={{ background: highlight }}
      />
      {/* Top-edge light — the single detail that stops a gradient fill reading flat. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
      />
      {children}
    </motion.button>
  )
}
