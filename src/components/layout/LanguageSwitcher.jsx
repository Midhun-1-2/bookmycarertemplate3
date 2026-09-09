import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { LANGUAGES } from '../../i18n'
import { cn } from '../../lib/cn'
import { dropdown } from '../../lib/motion'

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-semibold transition-colors duration-300',
          open
            ? 'border-brand-500/40 bg-brand-500/10 text-brand-700'
            : 'border-line bg-slate-900/[0.025] text-slate-500 hover:border-line-strong hover:text-slate-900'
        )}
      >
        <Globe size={14} />
        {current.label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdown}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute right-0 top-full z-50 mt-2 w-44 rounded-3xl border border-line bg-surface p-1.5 shadow-[0_24px_48px_-28px_rgba(35,31,32,0.35)]"
          >
            {LANGUAGES.map((lang, i) => {
              const active = lang.code === i18n.language
              return (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.28 }}
                  onClick={() => {
                    i18n.changeLanguage(lang.code)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition-colors',
                    active
                      ? 'bg-brand-600/12 font-semibold text-brand-700'
                      : 'text-slate-600 hover:bg-slate-900/[0.04] hover:text-slate-900'
                  )}
                >
                  {lang.label}
                  {active && <Check size={14} />}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
