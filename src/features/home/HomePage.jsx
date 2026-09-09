import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ShieldCheck,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDown,
  Search,
  UserCheck,
  HeartHandshake,
  Users,
  Building2,
  Sparkle,
} from 'lucide-react'
import { categoriesApi } from '../../lib/mockApi'
import { getCategoryPhotoUrl, HERO_PHOTO_URL } from '../../lib/categoryImages'
import Carousel from '../../components/Carousel/Carousel'
import CategoryCard from '../../components/CategoryCard'
import Button from '../../components/ui/Button'
import Reveal, { RevealGroup, RevealItem } from '../../components/motion/Reveal'
import TextReveal from '../../components/motion/TextReveal'
import CountUp from '../../components/motion/CountUp'
import Magnetic from '../../components/motion/Magnetic'
import BlobField from '../../components/motion/BlobField'
import { EASE_OUT_EXPO, SPRING_SOFT, stagger, fadeUp, floatLoop } from '../../lib/motion'

/** Section label: bold tracked eyebrow with a gradient rule running out of it.
 *  `onInk` switches it to the tint used on the black panel. */
function SectionEyebrow({ children, className = '', onInk = false }) {
  return (
    <span
      className={`eyebrow flex items-center gap-3 ${onInk ? 'text-brand-400' : 'text-brand-700'} ${className}`}
    >
      <span
        className={`h-[3px] w-10 rounded-full bg-gradient-to-r to-transparent ${onInk ? 'from-brand-400' : 'from-brand-600'}`}
      />
      {children}
    </span>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const categories = categoriesApi.listSync()

  const heroRef = useRef(null)
  const processRef = useRef(null)

  // Hero parallax: the portrait drifts up as the page scrolls past.
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroImageY = useTransform(heroProgress, [0, 1], ['0%', '16%'])
  const heroCopyY = useTransform(heroProgress, [0, 1], ['0%', '-14%'])
  const heroFade = useTransform(heroProgress, [0, 0.85], [1, 0])

  // The process rail draws itself as the section scrolls through the viewport.
  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    offset: ['start 75%', 'end 60%'],
  })
  const railScale = useSpring(processProgress, { stiffness: 120, damping: 28 })

  const TRUST_POINTS = [
    { icon: ShieldCheck, label: t('trust.verified') },
    { icon: Clock, label: t('trust.flexible') },
    { icon: Star, label: t('trust.rated') },
  ]

  const STATS = [
    { icon: Users, value: 12400, suffix: '+', label: t('stats.families') },
    { icon: HeartHandshake, value: 860, suffix: '+', label: t('stats.caregivers') },
    { icon: Building2, value: 24, suffix: '', label: t('stats.cities') },
    { icon: Star, value: 4.8, decimals: 1, suffix: '/5', label: t('stats.rating') },
  ]

  const STEPS = [
    { icon: Search, title: t('process.step1Title'), body: t('process.step1Body') },
    { icon: UserCheck, title: t('process.step2Title'), body: t('process.step2Body') },
    { icon: HeartHandshake, title: t('process.step3Title'), body: t('process.step3Body') },
  ]

  const slides = categories.slice(0, 3).map((cat) => ({
    id: cat.id,
    title: cat.name,
    description: cat.description,
    ctaLabel: t('carousel.exploreServices'),
    ctaTo: `/services/${cat.slug}`,
    image: getCategoryPhotoUrl(cat.icon, { w: 1400, q: 80 }),
  }))

  return (
    <div>
      {/* ================= HERO ================= */}
      <section ref={heroRef} className="relative overflow-hidden">
        <BlobField />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-24">
          <motion.div style={{ y: heroCopyY, opacity: heroFade }}>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-2 w-2 animate-pulse-ring rounded-full bg-brand-500" />
                <span className="h-2 w-2 rounded-full bg-brand-600" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
                {t('hero.badge')}
              </span>
            </motion.span>

            <h1 className="mt-7 text-[2.6rem] font-bold leading-[0.98] tracking-[-0.03em] text-slate-900 sm:text-6xl lg:text-[4.4rem]">
              <TextReveal as="span" text={t('hero.title1')} animateOnMount delay={0.15} />
              <br />
              <TextReveal
                as="span"
                text={t('hero.title2')}
                animateOnMount
                delay={0.32}
                highlight={[0, 1, 2, 3, 4, 5]}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE_OUT_EXPO }}
              className="mt-7 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              variants={stagger(0.08, 0.7)}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <motion.div variants={fadeUp}>
                <Magnetic strength={8}>
                  <Link to="/login/user">
                    <Button size="lg" magnetic={false}>
                      {t('hero.cta1')}
                      <ArrowUpRight size={18} />
                    </Button>
                  </Link>
                </Magnetic>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link to="/services">
                  <Button size="lg" variant="secondary">
                    {t('hero.cta2')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.ul
              variants={stagger(0.08, 0.9)}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:flex-wrap sm:gap-x-8"
            >
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <motion.li
                  key={label}
                  variants={fadeUp}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-slate-500"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-700">
                    <Icon size={14} />
                  </span>
                  {label}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Portrait: a blob-shaped frame with a spinning gradient ring, plus two
              floating glass chips — a different silhouette from Template 2's
              rectangular off-centre hairline frame. */}
          <motion.div
            style={{ y: heroImageY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="gradient-ring relative overflow-hidden rounded-[38%_62%_63%_37%/41%_44%_56%_59%] p-1.5">
              <div className="relative overflow-hidden rounded-[38%_62%_63%_37%/41%_44%_56%_59%]">
                <img
                  src={HERO_PHOTO_URL}
                  alt={t('home.heroImageAlt')}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/20 via-transparent to-transparent" />
              </div>
            </div>

            <motion.div
              {...floatLoop}
              className="glass absolute -right-3 top-8 flex items-center gap-3 rounded-3xl px-4 py-3 sm:-right-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-500">
                <Star size={17} fill="currentColor" strokeWidth={0} />
              </span>
              <div>
                <p className="text-lg font-bold leading-none text-slate-900">4.8</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {t('home.chipRatingSub')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: EASE_OUT_EXPO }}
              className="glass absolute -bottom-4 -left-3 flex items-center gap-2 rounded-full px-3.5 py-2 sm:-left-6"
            >
              <Sparkle size={13} className="text-brand-600" />
              <span className="text-[11px] font-bold text-slate-700">
                {t('trust.verified')}
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: heroFade }}
          className="mx-auto hidden max-w-7xl items-center gap-2 px-8 pb-10 lg:flex"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-slate-400"
          >
            <ArrowDown size={14} />
          </motion.span>
          <span className="eyebrow text-slate-400">{t('home.scrollCue')}</span>
        </motion.div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl border-t border-line px-5 py-16 sm:px-8 lg:py-24">
        <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <RevealItem key={s.label}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={SPRING_SOFT}
                className="glass flex h-full flex-col gap-3 rounded-[24px] p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-700">
                  <s.icon size={16} />
                </span>
                <p className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  <CountUp value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} duration={1.8} />
                </p>
                <p className="text-[13px] leading-snug text-slate-500">{s.label}</p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ================= FEATURED CAROUSEL ================= */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <Reveal>
          <Carousel slides={slides} />
        </Reveal>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal variant="fade">
              <SectionEyebrow>{t('home.categoriesEyebrow')}</SectionEyebrow>
            </Reveal>
            <TextReveal
              text={t('browse.title')}
              className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
              highlight={[2, 3]}
            />
            <Reveal delay={0.15}>
              <p className="mt-3 max-w-md text-sm text-slate-500 sm:text-base">
                {t('browse.subtitle')}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link to="/services">
              <Button variant="outline" size="md">
                {t('browse.viewAll')}
                <ArrowUpRight size={15} />
              </Button>
            </Link>
          </Reveal>
        </div>

        <RevealGroup gap={0.06} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <RevealItem key={cat.id}>
              <CategoryCard category={cat} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ================= PROCESS ================= */}
      <section ref={processRef} className="relative border-b border-line py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-14 max-w-2xl">
            <Reveal variant="fade">
              <SectionEyebrow>{t('process.eyebrow')}</SectionEyebrow>
            </Reveal>
            <TextReveal
              text={t('process.title')}
              className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
              highlight={[3, 4]}
            />
          </div>

          <div className="relative">
            <span
              aria-hidden
              className="absolute left-[1.4rem] top-2 hidden h-[calc(100%-3rem)] w-0.5 rounded-full bg-line lg:left-0 lg:top-[1.4rem] lg:h-0.5 lg:w-full"
            />
            <motion.span
              aria-hidden
              style={{ scaleY: railScale, scaleX: railScale }}
              className="absolute left-[1.4rem] top-2 hidden h-[calc(100%-3rem)] w-0.5 origin-top rounded-full bg-gradient-to-b from-brand-600 to-brand-600/0 lg:left-0 lg:top-[1.4rem] lg:h-0.5 lg:w-full lg:origin-left lg:bg-gradient-to-r"
            />

            <RevealGroup gap={0.12} className="grid gap-10 lg:grid-cols-3 lg:gap-8">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <RevealItem key={title} className="relative pl-16 lg:pl-0 lg:pt-16">
                  <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-brand-500/35 bg-gradient-to-br from-void to-brand-500/10 text-brand-700 shadow-[0_6px_16px_-8px_rgba(221,34,43,0.4)]">
                    <Icon size={18} />
                  </span>
                  <p className="text-[11px] font-bold tracking-[0.18em] text-slate-400">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2.5 text-xl font-bold tracking-tight text-slate-900">{title}</h3>
                  <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-slate-500">{body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal variant="scale">
          <div className="ink-panel relative overflow-hidden rounded-[2.75rem] px-6 py-16 text-center sm:px-14 sm:py-20">
            <BlobField tone="ink" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]"
            />

            <div className="relative">
              <SectionEyebrow onInk className="justify-center">
                {t('home.ctaEyebrow')}
              </SectionEyebrow>
              <TextReveal
                text={t('home.ctaTitle')}
                className="mx-auto mt-6 max-w-3xl text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl"
                wordClassName=""
                highlight={[]}
              />
              <Reveal delay={0.15}>
                <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                  {t('home.ctaSubtitle')}
                </p>
              </Reveal>
              <Reveal delay={0.25} className="mt-9 flex flex-wrap justify-center gap-3">
                <Magnetic strength={10}>
                  <Link to="/login/user">
                    <Button size="lg" magnetic={false}>
                      {t('home.ctaButton')}
                      <ArrowUpRight size={18} />
                    </Button>
                  </Link>
                </Magnetic>
                <Link to="/become-a-caregiver">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="border border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
                  >
                    {t('nav.becomeACaregiver')}
                  </Button>
                </Link>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
