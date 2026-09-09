import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCategoryIcon } from '../lib/icons'
import { getCategoryPhotoUrl } from '../lib/categoryImages'
import Spotlight from './motion/Spotlight'
import Tilt from './motion/Tilt'
import { EASE_OUT_EXPO } from '../lib/motion'

/**
 * Category tile. Full colour at rest (Template 2 desaturates until hover;
 * here the photography stays warm and the icon chip does the work of
 * signalling interactivity), inside a much rounder, tilt-and-spotlight frame.
 */
export default function CategoryCard({ category, showServices = false }) {
  const { t } = useTranslation()
  const Icon = getCategoryIcon(category.icon)

  return (
    <Tilt className="h-full" max={6} lift={6}>
      <Link to={`/services/${category.slug}`} className="block h-full">
        <Spotlight className="glass group flex h-full flex-col rounded-[28px] transition-[border-color] duration-500 hover:border-brand-500/40">
          <div className="relative h-44 w-full overflow-hidden rounded-t-[28px]">
            <img
              src={getCategoryPhotoUrl(category.icon, { w: 640 })}
              alt={category.name}
              loading="lazy"
              className="h-full w-full scale-105 object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-115"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-transparent" />

            <motion.span
              whileHover={{ rotate: -8, scale: 1.05 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-surface/95 text-brand-700 shadow-sm backdrop-blur-md transition-colors duration-500 group-hover:border-brand-600 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white"
            >
              <Icon size={19} />
            </motion.span>

            <span className="absolute right-5 top-5 rounded-full border border-white/30 bg-ink/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
              {String(category.services.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5 pt-1">
            <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900">
              {category.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
              {category.description}
            </p>

            {showServices && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {category.services.slice(0, 3).map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-line bg-slate-900/[0.025] px-2.5 py-1 text-[11px] font-medium text-slate-500"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}

            <span className="mt-auto flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-brand-700">
              {t('browse.explore')}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </div>
        </Spotlight>
      </Link>
    </Tilt>
  )
}
