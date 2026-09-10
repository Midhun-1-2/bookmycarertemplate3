import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarClock, MapPin, ArrowRight } from 'lucide-react'
import { bookingsApi } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/dashboard/PageHeader'

export default function StaffEngagementsPage() {
  const { t } = useTranslation()
  const { session } = useSession()
  const [bookings, setBookings] = useState(null)

  useEffect(() => {
    async function load() {
      const all = await bookingsApi.list()
      setBookings(
        all
          .filter((b) => b.staffId === session.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .reverse()
      )
    }
    load()
  }, [session.id])

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t('staffEngagements.title')} subtitle={t('staffEngagements.subtitle')} />

      {bookings === null ? (
        <p className="mt-6 text-sm text-slate-400">{t('staffEngagements.loading')}</p>
      ) : bookings.length === 0 ? (
        <Card className="mt-6 text-center text-sm text-slate-500">{t('staffEngagements.empty')}</Card>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => (
            <Link key={b.id} to={`/staff/engagements/${b.id}`}>
              <Card interactive className="group flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate font-semibold text-slate-900">{b.serviceName}</p>
                    <Badge tone={STATUS_TONE[b.status]} className="shrink-0">{t(STATUS_LABEL[b.status])}</Badge>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    <CalendarClock size={12} /> {b.startDate} · {b.time}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                    <MapPin size={12} className="shrink-0" /> {b.address}
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-slate-400 transition-colors duration-400 group-hover:border-brand-600/50 group-hover:text-brand-700">
                  <ArrowRight size={16} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
