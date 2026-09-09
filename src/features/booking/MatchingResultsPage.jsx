import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, BadgeCheck, IndianRupee, MapPinned, MessageCircle, Phone } from 'lucide-react'
import {
  bookingsApi,
  matchStaffForBooking,
  confirmBookingMatch,
  getStaffAverageRating,
} from '../../lib/mockApi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { StarRatingDisplay } from '../../components/ui/StarRating'
import CaregiverChatModal from './CaregiverChatModal'
import CaregiverCallModal from './CaregiverCallModal'
import { EASE_OUT_EXPO } from '../../lib/motion'

export default function MatchingResultsPage() {
  const { t } = useTranslation()
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [matches, setMatches] = useState(null)
  const [allBookings, setAllBookings] = useState([])
  const [selecting, setSelecting] = useState(null)
  const [chatStaff, setChatStaff] = useState(null)
  const [callStaff, setCallStaff] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      const b = await bookingsApi.get(bookingId)
      if (!active) return
      setBooking(b)
      const m = await matchStaffForBooking(b)
      const all = await bookingsApi.list()
      if (!active) return
      setMatches(m)
      setAllBookings(all)
    }
    load()
    return () => {
      active = false
    }
  }, [bookingId])

  async function handleSelect(staffId) {
    setSelecting(staffId)
    await confirmBookingMatch(bookingId, staffId)
    navigate(`/user/book/${bookingId}/checkout`)
  }

  if (!booking || matches === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-[3px] border-line-strong border-t-brand-600" />
        <p className="text-sm text-slate-500">{t('booking.matchingLoading')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {t('booking.availableCaregiversTitle')}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {t('booking.matchedSubtitle', { serviceName: booking.serviceName })}
      </p>

      {matches.length === 0 ? (
        <Card className="mt-7 text-center text-sm text-slate-500">
          {t('booking.noCaregivers')}
        </Card>
      ) : (
        <div className="mt-7 space-y-4">
          {matches.map((staff, i) => (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_OUT_EXPO }}
            >
              <Card
                animate={false}
                interactive
                className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-base font-bold text-white shadow-[0_10px_24px_-12px_rgba(221,34,43,0.6)]">
                    {staff.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 font-bold text-slate-900">
                      {staff.name}
                      <BadgeCheck size={15} className="text-brand-500" />
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={12} /> {staff.area}, {staff.city} · {staff.experienceYears}{' '}
                      {t('booking.yrsExperience')}
                    </p>
                    <p className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <IndianRupee size={11} /> {staff.hourlyRate ?? '—'}/hr
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPinned size={11} /> {t('booking.upToPrefix')} {staff.serviceRadiusKm ?? '—'} km
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {staff.skills.map((s) => (
                        <Badge key={s} tone="brand">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-52">
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <StarRatingDisplay value={getStaffAverageRating(staff.id, allBookings, staff.rating)} />
                    <Badge tone={staff.available !== false ? 'success' : 'danger'}>
                      {staff.available !== false ? t('booking.available') : t('booking.notAvailable')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setChatStaff(staff)}>
                      <MessageCircle size={14} />
                      {t('booking.chat')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCallStaff(staff)}>
                      <Phone size={14} />
                      {t('booking.call')}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleSelect(staff.id)}
                    disabled={selecting !== null}
                  >
                    {selecting === staff.id ? t('booking.confirming') : t('booking.selectCaregiver')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <CaregiverChatModal
        staff={chatStaff}
        userId={booking.userId}
        userName={booking.contactName}
        open={!!chatStaff}
        onClose={() => setChatStaff(null)}
      />
      <CaregiverCallModal staff={callStaff} open={!!callStaff} onClose={() => setCallStaff(null)} />
    </div>
  )
}
