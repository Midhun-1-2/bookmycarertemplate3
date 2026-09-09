import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { fadeUp, VIEWPORT_EARLY } from '../../lib/motion'

/**
 * Frame for a chart: title row, optional control slot, then the plot.
 */
export default function ChartCard({ title, action, children, className }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_EARLY}
      className={cn('glass rounded-[24px] p-5', className)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </motion.section>
  )
}
