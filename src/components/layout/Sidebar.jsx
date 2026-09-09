import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { cn } from '../../lib/cn'
import { ROLE_LABEL } from '../../app/roleConfig'
import { usePendingCaregivers } from '../../lib/usePendingCaregivers'
import { SPRING_SOFT } from '../../lib/motion'

/**
 * Console navigation. The active item is a single shared-layout pill that
 * slides between rows, so switching sections reads as one continuous
 * movement. Rounder, glassier chrome than Template 2's flat rail, but the
 * same quiet, tool-like restraint once you're past the icon.
 */
function SidebarContent({ items, session, onLogout }) {
  const { t } = useTranslation()
  const pendingCaregivers = usePendingCaregivers()
  const badgeCounts = { pendingCaregivers: pendingCaregivers.length }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-ink text-white shadow-[0_6px_16px_-6px_rgba(221,34,43,0.55)]">
          <img src="/brand/icon.png" alt="" className="h-6 w-6 object-contain brightness-0 invert" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-slate-900">Book My Carer</p>
          <p className="eyebrow mt-0.5 truncate text-brand-600">{t(ROLE_LABEL[session?.role])}</p>
        </div>
      </div>

      <div className="rule-fade mx-5" />

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map(({ to, label, icon: Icon, badge }, i) => {
          const count = badge ? badgeCounts[badge] ?? 0 : 0
          return (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.5, ease: 'easeOut' }}
            >
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors duration-300',
                    isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                  )
                }
                end
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 shadow-[0_8px_20px_-8px_rgba(221,34,43,0.6)]"
                        transition={SPRING_SOFT}
                      />
                    )}
                    <Icon
                      size={17}
                      className={cn(
                        'shrink-0 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate">{t(label)}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          'inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'border border-amber-500/35 bg-amber-500/15 text-amber-700'
                        )}
                        title={t('adminStaff.pendingBadgeTitle', { count })}
                      >
                        {count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      <div className="border-t border-line p-3">
        <div className="mb-2 flex items-center gap-3 rounded-2xl bg-slate-900/[0.03] px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-600/15 text-xs font-bold text-brand-700">
            {(session?.name ?? '?').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-slate-800">{session?.name}</p>
            <p className="truncate text-[10px] text-slate-400">{session?.phone}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors duration-300 hover:bg-rose-600/12 hover:text-rose-600"
        >
          <LogOut size={16} />
          {t('sidebar.logout')}
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ items, session, onLogout }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-void/70 backdrop-blur-xl lg:block">
      <SidebarContent items={items} session={session} onLogout={onLogout} />
    </aside>
  )
}
