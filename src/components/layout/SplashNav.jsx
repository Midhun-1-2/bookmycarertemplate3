import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Menu, X, MapPin, ArrowUpRight, Sparkles, Home as HomeIcon, LayoutGrid } from 'lucide-react'
import { categoriesApi } from '../../lib/mockApi'
import { getCategoryIcon } from '../../lib/icons'
import { getCategoryPhotoUrl } from '../../lib/categoryImages'
import { useSession } from '../../lib/session'
import { ROLE_HOME } from '../../app/roleConfig'
import Button from '../ui/Button'
import LanguageSwitcher from './LanguageSwitcher'
import { cn } from '../../lib/cn'
import { EASE_OUT_EXPO, SPRING_SOFT, SPRING_BOUNCY, collapse, stagger, fadeUp } from '../../lib/motion'
import BlobField from '../motion/BlobField'

const LOCATIONS = ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Bengaluru', 'Chennai', 'Mumbai']

/**
 * Public header — a pill-shaped floating rail from the very first frame
 * (Template 2's nav is transparent until scroll; this one always announces
 * itself as a glass capsule, which is the more "app-like" pattern this
 * design leans into). It still tightens and gains a shadow once the page
 * scrolls, and the active link is a shared-layout pill.
 */
export default function SplashNav() {
  const { t } = useTranslation()
  const categories = categoriesApi.listSync()
  const { session } = useSession()
  const location = useLocation()

  const [condensed, setCondensed] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setCondensed(y > 24))

  const servicesCloseTimer = useRef(null)
  const locationCloseTimer = useRef(null)

  function openServices() {
    clearTimeout(servicesCloseTimer.current)
    setServicesOpen(true)
  }
  function scheduleCloseServices() {
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), 250)
  }
  function openLocation() {
    clearTimeout(locationCloseTimer.current)
    setLocationOpen(true)
  }
  function scheduleCloseLocation() {
    locationCloseTimer.current = setTimeout(() => setLocationOpen(false), 250)
  }

  const [routeAtOpen, setRouteAtOpen] = useState(location.pathname)
  if (routeAtOpen !== location.pathname) {
    setRouteAtOpen(location.pathname)
    if (mobileOpen) setMobileOpen(false)
  }

  // `overflow: hidden` on body alone doesn't stop touch-scroll on mobile
  // Safari/Chrome — the page behind the full-screen menu still scrolls under
  // the user's finger. Pinning the body with `position: fixed` at its current
  // offset is the reliable cross-browser lock; scroll position is restored on
  // close so the page doesn't jump.
  useEffect(() => {
    if (!mobileOpen) return
    const scrollY = window.scrollY
    const { body } = document
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'
    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [mobileOpen])

  const navLinkClass = ({ isActive }) =>
    cn(
      'relative rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-300',
      isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
    )

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
        <motion.div
          animate={{
            paddingLeft: condensed ? 10 : 16,
            paddingRight: condensed ? 10 : 16,
            boxShadow: condensed
              ? '0 18px 40px -22px rgba(14,36,29,0.35)'
              : '0 4px 16px -12px rgba(14,36,29,0.14)',
          }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="glass pointer-events-auto mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-4"
        >
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Book My Carer">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.06 }}
              transition={SPRING_SOFT}
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-ink text-white shadow-[0_6px_18px_-6px_rgba(221,34,43,0.6)]"
            >
              <img src="/brand/icon.png" alt="" className="h-5 w-5 object-contain brightness-0 invert" />
            </motion.span>
            <img
              src="/brand/wordmark.png"
              alt="Book My Carer"
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            <NavLink to="/" className={navLinkClass} end>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-brand-500/30 bg-brand-500/12"
                      transition={SPRING_SOFT}
                    />
                  )}
                  {t('nav.home')}
                </>
              )}
            </NavLink>

            <div className="relative" onMouseEnter={openServices} onMouseLeave={scheduleCloseServices}>
              <button
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-300',
                  servicesOpen ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                )}
              >
                {t('nav.careTypeServices')}
                <ChevronDown
                  size={14}
                  className={cn('transition-transform duration-300', servicesOpen && 'rotate-180')}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }}
                    transition={SPRING_SOFT}
                    className="absolute left-1/2 top-full z-50 mt-3 w-[46rem] -translate-x-1/2 rounded-[28px] border border-line bg-surface p-3 shadow-[0_24px_48px_-28px_rgba(35,31,32,0.35)]"
                  >
                    <motion.div
                      variants={stagger(0.035)}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-4 gap-1"
                    >
                      {categories.map((cat) => {
                        const Icon = getCategoryIcon(cat.icon)
                        return (
                          <motion.div key={cat.id} variants={fadeUp}>
                            <Link
                              to={`/services/${cat.slug}`}
                              className="group flex h-full flex-col gap-2.5 rounded-3xl p-3 transition-colors duration-300 hover:bg-brand-500/[0.06]"
                            >
                              <span className="relative h-16 overflow-hidden rounded-2xl">
                                <img
                                  src={getCategoryPhotoUrl(cat.icon, { w: 260, q: 60 })}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                                />
                                <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
                                <span className="absolute bottom-1.5 left-2 flex h-7 w-7 items-center justify-center rounded-xl border border-white/25 bg-ink/50 text-white backdrop-blur">
                                  <Icon size={14} />
                                </span>
                              </span>
                              <span className="text-[13px] font-semibold leading-snug text-slate-800 transition-colors group-hover:text-slate-900">
                                {cat.name}
                              </span>
                              <span className="mt-auto text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                                {cat.services.length} {t('nav.servicesCount')}
                              </span>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </motion.div>

                    <Link
                      to="/services"
                      className="mt-1 flex items-center justify-between rounded-3xl border border-line bg-brand-500/[0.05] px-4 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:border-brand-500/40 hover:text-brand-700"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles size={14} className="text-brand-500" />
                        {t('browse.viewAll')}
                      </span>
                      <ArrowUpRight size={15} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" onMouseEnter={openLocation} onMouseLeave={scheduleCloseLocation}>
              <button
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-300',
                  locationOpen ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                )}
              >
                <MapPin size={13} />
                {t('nav.location')}
                <ChevronDown
                  size={14}
                  className={cn('transition-transform duration-300', locationOpen && 'rotate-180')}
                />
              </button>
              <AnimatePresence>
                {locationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
                    className="absolute left-0 top-full z-50 mt-3 w-60 rounded-3xl border border-line bg-surface p-1.5 shadow-[0_24px_48px_-28px_rgba(35,31,32,0.35)]"
                  >
                    {LOCATIONS.map((loc, i) => (
                      <motion.button
                        key={loc}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * i, duration: 0.3, ease: EASE_OUT_EXPO }}
                        className="group flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-brand-500/[0.06] hover:text-slate-900"
                      >
                        {loc}
                        <ArrowUpRight
                          size={13}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            {session ? (
              <Link to={ROLE_HOME[session.role]}>
                <Button size="sm" variant="secondary">
                  {t('nav.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/become-a-caregiver" className="hidden xl:block">
                  <Button size="sm" variant="ghost">
                    {t('nav.becomeACaregiver')}
                  </Button>
                </Link>
                <Link to="/login/staff">
                  <Button size="sm" variant="outline">
                    {t('nav.caregiverLogin')}
                  </Button>
                </Link>
                <Link to="/login/user">
                  <Button size="sm" variant="primary">
                    {t('nav.loginBookNow')}
                    <ArrowUpRight size={15} />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-slate-900/[0.03] text-slate-700 transition-colors hover:border-brand-500/40 hover:text-brand-700 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={t('sidebar.openMenu')}
          >
            <Menu size={19} />
          </button>
        </motion.div>
      </header>

      {/* Mobile: full-bleed panel, rising in from the bottom-left. Transform +
          opacity only (no `clip-path` / `backdrop-filter`) — animating a blurred
          mask across the full viewport every frame is what was causing the
          flicker on mobile GPUs; a plain scale/opacity reveal is compositor-only
          and costs nothing. The panel's own background is opaque, so there's
          nothing to blur through anyway. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 overflow-y-auto bg-void"
              style={{ transformOrigin: 'bottom left' }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: 'easeIn' } }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            >
              <BlobField tone="quiet" />

              <div className="relative flex h-16 items-center justify-between px-5 pt-3">
                <img src="/brand/wordmark.png" alt="Book My Carer" className="h-9 w-auto" />
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  whileTap={{ scale: 0.9, rotate: 90 }}
                  transition={SPRING_BOUNCY}
                  className="glass flex h-9 w-9 items-center justify-center rounded-full text-slate-600"
                  aria-label={t('sidebar.closeMenu')}
                >
                  <X size={16} />
                </motion.button>
              </div>

              <motion.div
                variants={stagger(0.06, 0.15)}
                initial="hidden"
                animate="show"
                className="relative px-5 pb-16 pt-4"
              >
                <motion.div variants={fadeUp}>
                  <Link to="/" className="block">
                    <motion.span
                      whileTap={{ scale: 0.97 }}
                      transition={SPRING_BOUNCY}
                      className="glass flex items-center gap-3 rounded-2xl px-3.5 py-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 text-brand-600">
                        <HomeIcon size={15} />
                      </span>
                      <span className="flex-1 font-display text-[13px] font-bold text-slate-900">
                        {t('nav.home')}
                      </span>
                      <ArrowUpRight size={14} className="shrink-0 text-slate-400" />
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-2.5">
                  <motion.button
                    onClick={() => setMobileSection(mobileSection === 'services' ? null : 'services')}
                    whileTap={{ scale: 0.97 }}
                    transition={SPRING_BOUNCY}
                    className={cn(
                      'glass flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors duration-300',
                      mobileSection === 'services' && 'border-brand-500/30'
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 text-brand-600">
                      <LayoutGrid size={15} />
                    </span>
                    <span className="flex-1 font-display text-[13px] font-bold text-slate-900">
                      {t('nav.careTypeServices')}
                    </span>
                    <ChevronDown
                      size={15}
                      className={cn(
                        'shrink-0 text-slate-400 transition-transform duration-400',
                        mobileSection === 'services' && 'rotate-180 text-brand-500'
                      )}
                    />
                  </motion.button>
                  <AnimatePresence initial={false}>
                    {mobileSection === 'services' && (
                      <motion.div
                        variants={collapse}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 pb-1 pt-2.5">
                          {categories.map((cat) => {
                            const Icon = getCategoryIcon(cat.icon)
                            return (
                              <Link
                                key={cat.id}
                                to={`/services/${cat.slug}`}
                                className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-2.5 text-xs font-medium leading-snug text-slate-700 shadow-sm"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-500/10 text-brand-600">
                                  <Icon size={12} />
                                </span>
                                {cat.name}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-2.5">
                  <motion.button
                    onClick={() => setMobileSection(mobileSection === 'location' ? null : 'location')}
                    whileTap={{ scale: 0.97 }}
                    transition={SPRING_BOUNCY}
                    className={cn(
                      'glass flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors duration-300',
                      mobileSection === 'location' && 'border-brand-500/30'
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 text-brand-600">
                      <MapPin size={15} />
                    </span>
                    <span className="flex-1 font-display text-[13px] font-bold text-slate-900">
                      {t('nav.location')}
                    </span>
                    <ChevronDown
                      size={15}
                      className={cn(
                        'shrink-0 text-slate-400 transition-transform duration-400',
                        mobileSection === 'location' && 'rotate-180 text-brand-500'
                      )}
                    />
                  </motion.button>
                  <AnimatePresence initial={false}>
                    {mobileSection === 'location' && (
                      <motion.div
                        variants={collapse}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 pb-1 pt-2.5">
                          {LOCATIONS.map((loc) => (
                            <span
                              key={loc}
                              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm"
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-5 flex justify-center">
                  <LanguageSwitcher />
                </motion.div>

                <motion.div variants={fadeUp} className="rule-fade my-6" />

                <motion.div variants={fadeUp} className="flex flex-col gap-2">
                  {session ? (
                    <Link to={ROLE_HOME[session.role]}>
                      <Button className="w-full" size="md" variant="secondary">
                        {t('nav.dashboard')}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login/user">
                        <Button className="w-full" size="md" variant="primary">
                          {t('nav.loginBookNow')}
                          <ArrowUpRight size={14} />
                        </Button>
                      </Link>
                      <Link to="/login/staff">
                        <Button className="w-full" size="md" variant="outline">
                          {t('nav.caregiverLogin')}
                        </Button>
                      </Link>
                      <Link to="/become-a-caregiver">
                        <Button className="w-full" size="sm" variant="ghost">
                          {t('nav.becomeACaregiver')}
                        </Button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
