import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Spotlight from '../motion/Spotlight'
import CountUp from '../motion/CountUp'
import { cn } from '../../lib/cn'
import { EASE_OUT_EXPO } from '../../lib/motion'

/**
 * KPI tile. The figure is the tile — set large in the display face, with the
 * label demoted to a small tracked caption. Numeric values count up on first
 * view.
 */
export default function StatTile({
  label,
  value,
  icon: Icon,
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  tone = 'brand',
  index = 0,
  className,
}) {
  const numeric = typeof value === 'number'

  const tones = {
    brand: 'border-brand-500/30 bg-brand-500/12 text-brand-700',
    gold: 'border-gold-500/30 bg-gold-500/12 text-gold-500',
    accent: 'border-accent-500/30 bg-accent-500/12 text-accent-700',
    success: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-600',
  }

  const body = (
    <Spotlight
      className={cn(
        'glass flex h-full flex-col rounded-[24px] p-5 transition-[border-color,transform] duration-500',
        to && 'hover:-translate-y-1 hover:border-brand-500/40',
        className
      )}
      radius={280}
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <span
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-2xl border',
              tones[tone] ?? tones.brand
            )}
          >
            <Icon size={18} />
          </span>
        )}
        {to && (
          <ArrowUpRight
            size={15}
            className="text-slate-400 transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700"
          />
        )}
      </div>

      <p className="mt-5 font-display text-3xl font-bold leading-none tracking-tight text-slate-900">
        {numeric ? (
          <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} duration={1.3} />
        ) : (
          value
        )}
      </p>
      <p className="mt-2.5 text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-slate-400">
        {label}
      </p>
    </Spotlight>
  )

  const wrapped = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE_OUT_EXPO }}
      className="h-full"
    >
      {body}
    </motion.div>
  )

  return to ? (
    <Link to={to} className="block h-full">
      {wrapped}
    </Link>
  ) : (
    wrapped
  )
}
