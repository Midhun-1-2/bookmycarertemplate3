import { forwardRef, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { EASE_OUT_EXPO } from '../../lib/motion'

/**
 * Text field.
 *
 * A softly-rounded well, brighter than Template 2's inset-dark treatment —
 * this design is light-on-light, so focus is carried entirely by colour: the
 * border warms to coral and a matching glow blooms outward, plus a centre-out
 * gradient underline for a second, quieter signal.
 */
const Input = forwardRef(function Input(
  { label, error, hint, className, id, containerClassName, ...props },
  ref
) {
  const reactId = useId()
  const inputId = id || props.name || reactId
  const [focused, setFocused] = useState(false)

  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-[11px] font-bold uppercase tracking-[0.13em] transition-colors duration-300',
            focused ? 'text-brand-600' : 'text-slate-400'
          )}
        >
          {label}
          {props.required && <span className="ml-1 text-brand-600">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          className={cn(
            'peer h-12 w-full rounded-2xl border-2 bg-surface px-4 text-sm text-slate-900 outline-none transition-[border-color,background-color,box-shadow] duration-300',
            'placeholder:text-slate-400/70',
            'border-line hover:border-line-strong',
            'focus:border-brand-500 focus:shadow-[0_0_0_5px_rgba(255,90,46,0.13)]',
            error && 'border-rose-500 focus:border-rose-500 focus:shadow-[0_0_0_5px_rgba(194,31,82,0.14)]',
            className
          )}
          {...props}
        />
        {/* Centre-out gradient underline wipe on focus. */}
        <motion.span
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-[calc(100%-1.5rem)] -translate-x-1/2 origin-center rounded-full',
            error ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-600 via-amber-400 to-brand-600'
          )}
          initial={false}
          animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs font-medium text-rose-600"
          >
            <AlertCircle size={13} />
            {error}
          </motion.span>
        ) : hint ? (
          <span key="hint" className="text-xs text-slate-400">
            {hint}
          </span>
        ) : null}
      </AnimatePresence>
    </div>
  )
})

export default Input
