import { cn } from '../../lib/cn'

/**
 * Continuous auto-scrolling strip — trust badges, category chips, stat
 * highlights. Duplicates its children once so the CSS translate loop from 0%
 * to -50% never shows a seam.
 */
export default function Marquee({ children, className, durationS = 28, reverse = false, gap = 'gap-8' }) {
  return (
    <div className={cn('group/marquee relative overflow-hidden', className)}>
      <div
        className={cn('flex w-max shrink-0 items-center', gap, 'animate-[marquee_linear_infinite] group-hover/marquee:[animation-play-state:paused]')}
        style={{ animationDuration: `${durationS}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <div className={cn('flex shrink-0 items-center', gap)}>{children}</div>
        <div className={cn('flex shrink-0 items-center', gap)} aria-hidden>{children}</div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
