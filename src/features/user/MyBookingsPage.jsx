import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CalendarClock, MapPin, ArrowUpRight, IndianRupee } from 'lucide-react'
import { bookingsApi } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/dashboard/PageHeader'
import Spotlight from '../../components/motion/Spotlight'
import { EASE_OUT_EXPO } from '../../lib/motion'

const PAYMENT_STATUS_LABEL = {
  paid: 'userMyBookings.paymentStatus.paid',
  pending: 'userMyBookings.paymentStatus.pending',
}

export default function MyBookingsPage() {
  const { t } = useTranslation()
  const { session } = useSession()
  const [bookings, setBookings] = useState(null)

  useEffect(() => {
    async function load() {
      const all = await bookingsApi.list()
      setBookings(
        all
          .filter((b) => b.userId === session.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      )
    }
    load()
  }, [session.id])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title={t('userMyBookings.title')} subtitle={t('userMyBookings.subtitle')} />

      {bookings === null ? (
        <p className="mt-6 text-sm text-slate-400">{t('userMyBookings.loading')}</p>
      ) : bookings.length === 0 ? (
        <Card animate={false} className="mt-6 text-center text-sm text-slate-500">
          {t('userMyBookings.emptyState')}{' '}
          <Link to="/user/dashboard" className="font-semibold text-brand-700 hover:underline">
            {t('userMyBookings.browseServices')}
          </Link>
        </Card>
      ) : (
        <div className="mt-6 space-y-3.5">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE_OUT_EXPO }}
            >
              <Link to={`/user/bookings/${b.id}`} className="block">
                <Spotlight className="glass group flex flex-col justify-between gap-3 rounded-[24px] p-5 transition-[border-color,transform] duration-400 hover:-translate-y-0.5 hover:border-brand-500/40 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold tracking-tight text-slate-900">{b.serviceName}</p>
                      <Badge tone={STATUS_TONE[b.status]}>{t(STATUS_LABEL[b.status])}</Badge>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                      <CalendarClock size={12} /> {b.startDate} · {b.time}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                      <MapPin size={12} className="shrink-0" /> {b.address}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                    <p className="flex items-center text-base font-bold text-brand-700">
                      <IndianRupee size={14} />
                      {b.payment.amount}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                      {t(PAYMENT_STATUS_LABEL[b.payment.status])}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="hidden shrink-0 text-slate-300 transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700 sm:block"
                  />
                </Spotlight>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
