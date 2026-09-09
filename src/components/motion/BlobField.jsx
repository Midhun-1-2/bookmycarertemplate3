import { cn } from '../../lib/cn'

/**
 * Ambient background blobs — three softly-blurred, organically-morphing shapes
 * drifting behind hero/CTA sections. This is the signature Aurora Bloom motif
 * that has no equivalent in Template 2's editorial-hairline language: colour
 * as weather, not just as accent.
 *
 * Pure CSS animation (see `--animate-drift` / `--animate-drift-slow` in
 * index.css) rather than framer-motion — it never needs to respond to input,
 * so there's no reason to pay for a JS-driven loop.
 */
export default function BlobField({ className, tone = 'default' }) {
  const palettes = {
    default: ['bg-brand-400/35', 'bg-amber-300/30', 'bg-accent-400/22'],
    ink: ['bg-brand-500/30', 'bg-amber-400/22', 'bg-accent-500/18'],
    quiet: ['bg-brand-300/20', 'bg-amber-200/18', 'bg-accent-300/14'],
  }
  const [a, b, c] = palettes[tone] ?? palettes.default

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      <div className={cn('absolute -left-24 top-[-4rem] h-96 w-96 animate-drift rounded-full blur-[90px]', a)} />
      <div className={cn('absolute right-[-6rem] top-1/4 h-[26rem] w-[26rem] animate-drift-slow rounded-full blur-[100px]', b)} />
      <div className={cn('absolute bottom-[-6rem] left-1/3 h-80 w-80 animate-drift rounded-full blur-[90px] [animation-delay:-6s]', c)} />
    </div>
  )
}
