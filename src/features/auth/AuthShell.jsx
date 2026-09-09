import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ShieldCheck, Clock, Star, Users } from 'lucide-react'
import { HERO_PHOTO_URL, getCategoryPhotoUrl } from '../../lib/categoryImages'
import MinimalFooter from '../../components/layout/MinimalFooter'
import BlobField from '../../components/motion/BlobField'
import CountUp from '../../components/motion/CountUp'
import { EASE_OUT_EXPO, SPRING_SOFT, SPRING_BOUNCY, stagger, fadeUp, floatLoop } from '../../lib/motion'

/**
 * Split-screen frame shared by sign-in and caregiver registration — mirrored
 * from Template 2 (brand panel on the RIGHT here, form on the left) and built
 * from a floating rounded portrait rather than a full-bleed photo, so the two
 * templates never share a silhouette even though both use the same red/black
 * brand pair.
 *
 * Below `lg` the brand panel is dropped entirely: on a phone it would push
 * the actual task below the fold.
 */
export default function AuthShell({ children, wide = false }) {
  const { t } = useTranslation()

  const POINTS = [
    { icon: ShieldCheck, label: t('trust.verified') },
    { icon: Clock, label: t('trust.flexible') },
    { icon: Star, label: t('trust.rated') },
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col lg:flex-row-reverse">
        {/* ---------- Brand panel ----------
            `wide` pages (the longer registration form) get a slimmer, leaner
            version of this panel — no portrait, smaller type — so the form
            column has the room it needs and the page scrolls less overall. */}
        <aside
          className={`relative hidden shrink-0 overflow-hidden bg-ink lg:block ${wide ? 'lg:w-[30%]' : 'w-[42%]'}`}
        >
          <BlobField tone="ink" />
          <div className="absolute inset-0 bg-gradient-to-bl from-ink via-ink/92 to-ink/80" />

          <motion.div
            variants={stagger(0.09, 0.15)}
            initial="hidden"
            animate="show"
            className={`relative flex h-full flex-col justify-between ${wide ? 'p-8 xl:p-10' : 'p-10 xl:p-14'}`}
          >
            <motion.div variants={fadeUp}>
              <Link to="/" className="inline-block">
                <img src="/brand/wordmark.png" alt="Book My Carer" className="h-12 w-auto brightness-0 invert" />
              </Link>
            </motion.div>

            {wide ? (
              <div>
                <motion.div
                  variants={fadeUp}
                  className="relative mb-7 h-40 w-full overflow-hidden rounded-3xl border border-white/10 xl:h-48"
                >
                  <motion.img
                    src={getCategoryPhotoUrl('HeartHandshake', { w: 500, q: 80 })}
                    alt=""
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.2, ease: EASE_OUT_EXPO }}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />

                  {/* Community-size proof, not a star rating — this panel is
                      recruiting caregivers, so the number that matters here is
                      how many peers they'd be joining. */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ ...SPRING_BOUNCY, delay: 0.5 }}
                    className="glass absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-900 shadow-lg"
                  >
                    <Users size={12} className="text-brand-600" />
                    <CountUp value={860} suffix="+" duration={1.4} /> {t('stats.caregivers')}
                  </motion.span>

                  <motion.span
                    {...floatLoop}
                    className="glass absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-900 shadow-lg"
                  >
                    <ShieldCheck size={12} className="text-emerald-600" />
                    {t('trust.verified')}
                  </motion.span>
                </motion.div>

                <motion.p variants={fadeUp} className="eyebrow text-brand-400">
                  {t('hero.badge')}
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="mt-4 font-display text-2xl font-bold leading-[1.1] tracking-tight text-white xl:text-3xl"
                >
                  {t('hero.title1')} <span className="text-brand-400">{t('hero.title2')}</span>
                </motion.h2>
              </div>
            ) : (
              <div>
                <motion.div
                  variants={fadeUp}
                  className="gradient-ring relative mx-auto mb-8 h-52 w-52 overflow-hidden rounded-[38%_62%_63%_37%/41%_44%_56%_59%] border border-white/10"
                >
                  <img src={HERO_PHOTO_URL} alt="" className="h-full w-full object-cover" />
                  <motion.span
                    {...floatLoop}
                    className="glass absolute -right-6 bottom-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-900 shadow-lg"
                  >
                    <Star size={12} className="fill-gold-400 text-gold-400" />
                    4.9 · {t('trust.rated')}
                  </motion.span>
                </motion.div>

                <motion.p variants={fadeUp} className="eyebrow text-center text-brand-400 lg:text-left">
                  {t('hero.badge')}
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="mt-5 text-center font-display text-4xl font-bold leading-[1.05] tracking-tight text-white lg:text-left xl:text-5xl"
                >
                  {t('hero.title1')} <span className="text-brand-400">{t('hero.title2')}</span>
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="mt-5 text-center text-sm leading-relaxed text-white/65 lg:text-left"
                >
                  {t('hero.subtitle')}
                </motion.p>
              </div>
            )}

            <motion.ul
              variants={fadeUp}
              className={`flex flex-wrap gap-3 border-t border-white/15 pt-7 ${wide ? '' : 'justify-center lg:justify-start'}`}
            >
              {POINTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-[12px] text-white/75"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/25 text-brand-300">
                    <Icon size={12} />
                  </span>
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </aside>

        {/* ---------- Form panel ---------- */}
        <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <Link
            to="/"
            className="group absolute left-5 top-6 inline-flex items-center gap-2 rounded-full border border-line bg-slate-900/[0.025] px-3.5 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:border-brand-500/40 hover:text-brand-700 sm:left-8"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            {t('nav.home')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.1 }}
            className={`w-full ${wide ? 'max-w-3xl' : 'max-w-sm'} pt-14 lg:pt-0`}
          >
            <Link to="/" className="mb-9 flex justify-center lg:hidden">
              <img src="/brand/wordmark.png" alt="Book My Carer" className="h-12 w-auto" />
            </Link>
            {children}
          </motion.div>
        </div>
      </div>

      <MinimalFooter />
    </div>
  )
}
