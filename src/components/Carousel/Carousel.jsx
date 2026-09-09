import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'
import { cn } from '../../lib/cn'
import { EASE_OUT_EXPO, stagger, fadeUp } from '../../lib/motion'

/**
 * Hero carousel. Slides cross-dissolve with a slow Ken Burns push; the
 * pagination dots double as autoplay progress, filling over the dwell time so
 * the interface never advances without warning. Rounder frame, bouncier drag
 * release and a brand-red progress fill are what set this apart from
 * Template 2's carousel.
 */
export default function Carousel({ slides, autoPlayMs = 6000 }) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const goTo = useCallback(
    (next) => {
      setDirection(next > index ? 1 : -1)
      setIndex((next + slides.length) % slides.length)
    },
    [index, slides.length]
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    timerRef.current = setTimeout(next, autoPlayMs)
    return () => clearTimeout(timerRef.current)
  }, [next, autoPlayMs, slides.length, paused, index])

  if (!slides.length) return null
  const slide = slides[index]

  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink shadow-[0_30px_60px_-30px_rgba(35,31,32,0.55)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[26rem] sm:h-[30rem]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) next()
              else if (info.offset.x > 70) prev()
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {slide.image && (
              <motion.img
                src={slide.image}
                alt={slide.title}
                draggable={false}
                initial={{ scale: 1.14 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'linear' }}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-brand-900/25" />

            <motion.div
              variants={stagger(0.08, 0.15)}
              initial="hidden"
              animate="show"
              className="relative flex h-full max-w-xl flex-col items-start justify-center gap-1 p-7 sm:p-12"
            >
              <motion.span
                variants={fadeUp}
                className="eyebrow mb-3 flex items-center gap-2 text-brand-400"
              >
                <span className="h-px w-8 bg-brand-500" />
                {t('carousel.featured')}
              </motion.span>
              <motion.h3
                variants={fadeUp}
                className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl"
              >
                {slide.title}
              </motion.h3>
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base"
              >
                {slide.description}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-7">
                <Link to={slide.ctaTo}>
                  <Button size="lg" variant="primary">
                    {slide.ctaLabel}
                    <ArrowUpRight size={17} />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-7 bottom-7 z-10 flex items-end justify-between gap-6 sm:inset-x-12">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={t('carousel.goToSlide', { number: i + 1 })}
                className={cn(
                  'h-1 cursor-pointer overflow-hidden rounded-full transition-all duration-500',
                  i === index ? 'w-12 bg-white/20' : 'w-4 bg-white/20 hover:bg-white/35'
                )}
              >
                {i === index && (
                  <motion.span
                    key={`${index}-${paused}`}
                    className="block h-full rounded-full bg-brand-600"
                    initial={{ width: '0%' }}
                    animate={{ width: paused ? '35%' : '100%' }}
                    transition={{ duration: paused ? 0.3 : autoPlayMs / 1000, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
            <span className="ml-2 text-[10px] font-semibold tracking-[0.14em] text-white/50">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            {[
              { fn: prev, Icon: ArrowLeft, label: t('carousel.previousSlide') },
              { fn: next, Icon: ArrowRight, label: t('carousel.nextSlide') },
            ].map(({ fn, Icon, label }) => (
              <motion.button
                key={label}
                onClick={fn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={label}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/20"
              >
                <Icon size={17} />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
