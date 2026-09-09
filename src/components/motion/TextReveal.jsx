import { motion } from 'framer-motion'
import { stagger, wordReveal, VIEWPORT } from '../../lib/motion'
import { cn } from '../../lib/cn'

/**
 * Headline that assembles itself word by word, each word hinging up from below
 * its own baseline in 3D with a light scale pop. The per-word `overflow-hidden`
 * mask is what makes it read as type being set rather than text sliding in.
 *
 * `highlight` marks words (by index) that get the sunrise gradient — one
 * accented phrase per headline is the house rule.
 */
export default function TextReveal({
  text,
  as = 'h2',
  className,
  wordClassName,
  highlight = [],
  delay = 0,
  gap = 0.05,
  once = true,
  animateOnMount = false,
}) {
  const Comp = motion[as] ?? motion.h2
  const words = String(text).split(' ')
  const marks = new Set(highlight)

  const trigger = animateOnMount
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { ...VIEWPORT, once } }

  return (
    <Comp
      className={cn('inline-block', className)}
      variants={stagger(gap, delay)}
      initial="hidden"
      style={{ perspective: 800 }}
      {...trigger}
    >
      {words.map((word, i) => (
        // Padding gives the clip box room for descenders/matras; the matching
        // negative margin takes that space back out of the line box so heading
        // leading is unaffected. Keep both or one edge of the glyph clips.
        <span
          key={`${word}-${i}`}
          className="-my-[0.32em] inline-block overflow-hidden py-[0.32em] align-bottom"
        >
          <motion.span
            variants={wordReveal}
            className={cn(
              'inline-block whitespace-pre',
              marks.has(i) && 'text-brand-gradient',
              wordClassName
            )}
            style={{ transformOrigin: 'bottom center' }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Comp>
  )
}
