import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { fadeUp, VIEWPORT_EARLY } from '../../lib/motion'

/**
 * The standard elevated surface: soft glass, generously rounded (28px, not
 * Template 2's 16px) so every panel reads as a rounded "bubble" rather than a
 * sheet of paper. Hovering lifts and scales the card fractionally rather than
 * just warming a border — a more physical, more playful response.
 */
export default function Card({
  className,
  children,
  animate = true,
  interactive = false,
  as = 'div',
  ...props
}) {
  const Comp = animate ? motion[as] ?? motion.div : as
  const motionProps = animate
    ? {
        variants: fadeUp,
        initial: 'hidden',
        whileInView: 'show',
        viewport: VIEWPORT_EARLY,
      }
    : {}

  return (
    <Comp
      className={cn(
        'glass relative rounded-[28px] p-5',
        interactive &&
          'transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-brand-300 hover:shadow-[0_2px_4px_rgba(14,36,29,0.05),0_28px_52px_-24px_rgba(14,36,29,0.32)]',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  )
}
