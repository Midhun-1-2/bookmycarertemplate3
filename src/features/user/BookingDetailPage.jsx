import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CalendarClock, MapPin, Phone, ShieldAlert, IndianRupee, ArrowLeft, KeyRound, MessageSquareText, XCircle } from 'lucide-react'
import { bookingsApi, staffApi, requestCheckInOtp, submitReview, cancelBooking } from '../../lib/mockApi'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import StarRating, { StarRatingDisplay } from '../../components/ui/StarRating'
import { EASE_OUT_EXPO } from '../../lib/motion'

const PAYMENT_STATUS_LABEL = {
  paid: 'userBookingDetail.paymentStatus.paid',
  pending: 'userBookingDetail.paymentStatus.pending',
}

const SCHEDULE_TYPE_LABEL = {
  hourly: 'userBookingDetail.scheduleType.hourly',
  daily: 'userBookingDetail.scheduleType.daily',
  weekly: 'userBookingDetail.scheduleType.weekly',
}

const CANCELLABLE_STATUSES = ['pending', 'confirmed']
const CANCEL_CUTOFF_MS = 60 * 60 * 1000

/** Small tracked section title used at the top of every card on this page. */
function SectionLabel({ icon: Icon, children }) {
  return (
    <h3 className="eyebrow flex items-center gap-2 text-brand-700">
      {Icon && <Icon size={13} />}
      {children}
    </h3>
  )
}

/** A single fact row: circular icon chip + text, used throughout the summary card. */
function InfoRow({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-700">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
        <Icon size={14} />
      </span>
      <span className="min-w-0">{children}</span>
    </div>
  )
}

/** Fade-up wrapper used to stagger each card down the page on mount. */
function Section({ index = 0, className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.05 + index * 0.06, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function BookingDetailPage() {
  const { t } = useTranslation()
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [staff, setStaff] = useState(null)
  const [otp, setOtp] = useState(null)
  const [otpPhase, setOtpPhase] = useState('checkin')
  const [generatingOtp, setGeneratingOtp] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const otpTimerRef = useRef(null)

  async function load() {
    const b = await bookingsApi.get(bookingId)
    setBooking(b)
    if (b?.checkIn) setOtpPhase('checkout')
    if (b?.staffId) setStaff(await staffApi.get(b.staffId))
  }

  useEffect(() => {
    load()
  }, [bookingId])

  useEffect(() => () => clearTimeout(otpTimerRef.current), [])

  async function handleGenerateOtp() {
    setGeneratingOtp(true)
    const code = await requestCheckInOtp(bookingId)
    setOtp(code)
    setGeneratingOtp(false)
    clearTimeout(otpTimerRef.current)
    otpTimerRef.current = setTimeout(() => {
      setOtp(null)
      setOtpPhase('checkout')
    }, 5000)
  }

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!reviewRating) return
    setSubmittingReview(true)
    await submitReview(bookingId, { rating: reviewRating, comment: reviewComment.trim() })
    setSubmittingReview(false)
    await load()
  }

  async function handleCancel() {
    setCancelling(true)
    await cancelBooking(bookingId)
    setCancelling(false)
    await load()
  }

  if (!booking) return null

  const isCancellableStatus = CANCELLABLE_STATUSES.includes(booking.status)
  const scheduledAt = new Date(`${booking.startDate}T${booking.time}`)
  const canCancel =
    isCancellableStatus &&
    !Number.isNaN(scheduledAt.getTime()) &&
    scheduledAt.getTime() - Date.now() > CANCEL_CUTOFF_MS

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/user/bookings"
        className="group flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-700"
      >
        <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        {t('userBookingDetail.backToBookings')}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {booking.serviceName}
        </h1>
        <Badge tone={STATUS_TONE[booking.status]}>{t(STATUS_LABEL[booking.status])}</Badge>
      </div>

      <Section index={0}>
        <Card className="mt-5 space-y-4" animate={false}>
          <InfoRow icon={CalendarClock}>
            {booking.startDate} {t('userBookingDetail.at')} {booking.time} ·{' '}
            <span className="capitalize">{t(SCHEDULE_TYPE_LABEL[booking.scheduleType])}</span>
          </InfoRow>
          <InfoRow icon={MapPin}>{booking.address}</InfoRow>
          <InfoRow icon={Phone}>
            {booking.contactName} · {booking.contactPhone}
          </InfoRow>
          <InfoRow icon={ShieldAlert}>
            {t('userBookingDetail.emergencyContact')} {booking.emergencyContact}
          </InfoRow>

          {booking.careTags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pl-11">
              {booking.careTags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {booking.notes && (
            <p className="ml-11 rounded-2xl bg-slate-900/[0.03] px-3.5 py-2.5 text-sm text-slate-600">
              {booking.notes}
            </p>
          )}
        </Card>
      </Section>

      {staff && (
        <Section index={1}>
          <Card className="mt-4" animate={false}>
            <SectionLabel>{t('userBookingDetail.yourCaregiver')}</SectionLabel>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white">
                {staff.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{staff.name}</p>
                <p className="truncate text-xs text-slate-500">{staff.skills.join(', ')}</p>
              </div>
            </div>
          </Card>
        </Section>
      )}

      <Section index={2}>
        <Card className="mt-4" animate={false}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{t('userBookingDetail.invoiceAmount')}</p>
            <p className="flex items-center font-display text-lg font-bold text-brand-700">
              <IndianRupee size={16} />
              {booking.payment.amount}
            </p>
          </div>
          <p className="mt-1 text-xs capitalize text-slate-400">
            {t('userBookingDetail.paymentPrefix')} {t(PAYMENT_STATUS_LABEL[booking.payment.status])}
          </p>
          {booking.payment.status === 'pending' && booking.staffId && (
            <Link to={`/user/book/${booking.id}/checkout`}>
              <Button className="mt-3 w-full">{t('userBookingDetail.payNow')}</Button>
            </Link>
          )}
          {booking.status === 'pending' && !booking.staffId && (
            <Link to={`/user/book/${booking.id}/match`}>
              <Button className="mt-3 w-full" variant="outline">
                {t('userBookingDetail.viewCaregiverMatches')}
              </Button>
            </Link>
          )}
        </Card>
      </Section>

      {isCancellableStatus && (
        <Section index={3}>
          <Card className="mt-4" animate={false}>
            <SectionLabel icon={XCircle}>{t('userBookingDetail.cancelBookingTitle')}</SectionLabel>
            <p className="mt-1.5 text-xs text-slate-500">{t('userBookingDetail.cancelWindowNote')}</p>
            <Button
              className="mt-3"
              variant="danger"
              onClick={handleCancel}
              disabled={!canCancel || cancelling}
            >
              {cancelling ? t('userBookingDetail.cancelling') : t('userBookingDetail.cancelBooking')}
            </Button>
            {!canCancel && (
              <p className="mt-2 text-xs text-rose-600">{t('userBookingDetail.cancelWindowClosed')}</p>
            )}
          </Card>
        </Section>
      )}

      {(booking.status === 'confirmed' || booking.status === 'in-progress') && (
        <Section index={4}>
          <Card className="mt-4" animate={false}>
            <SectionLabel icon={KeyRound}>
              {otpPhase === 'checkin'
                ? t('userBookingDetail.checkInPasscode')
                : t('userBookingDetail.checkOutPasscode')}
            </SectionLabel>
            <p className="mt-1.5 text-xs text-slate-500">{t('userBookingDetail.passcodeDescription')}</p>
            {otp ? (
              <p className="mt-4 text-center font-display text-4xl font-bold tracking-[0.3em] text-brand-700">
                {otp}
              </p>
            ) : (
              <Button className="mt-3" variant="outline" onClick={handleGenerateOtp} disabled={generatingOtp}>
                {generatingOtp
                  ? t('userBookingDetail.generating')
                  : otpPhase === 'checkin'
                    ? t('userBookingDetail.generatePasscode')
                    : t('userBookingDetail.generateCheckoutPasscode')}
              </Button>
            )}
          </Card>
        </Section>
      )}

      {(booking.checkIn || booking.checkOut) && (
        <Section index={5}>
          <Card className="mt-4" animate={false}>
            <SectionLabel>{t('userBookingDetail.shiftVerification')}</SectionLabel>
            <div className="mt-2.5 space-y-1.5 text-sm text-slate-700">
              {booking.checkIn && (
                <p>{t('userBookingDetail.checkedIn', { time: new Date(booking.checkIn).toLocaleString() })}</p>
              )}
              {booking.checkOut && (
                <p>{t('userBookingDetail.checkedOut', { time: new Date(booking.checkOut).toLocaleString() })}</p>
              )}
            </div>
          </Card>
        </Section>
      )}

      {booking.status === 'completed' && (
        <Section index={6}>
          <Card className="mt-4" animate={false}>
            <SectionLabel icon={MessageSquareText}>
              {booking.review ? t('userBookingDetail.yourReview') : t('userBookingDetail.rateYourCaregiver')}
            </SectionLabel>
            {booking.review ? (
              <div className="mt-3">
                <StarRatingDisplay value={booking.review.rating} size={16} />
                {booking.review.comment && (
                  <p className="mt-2.5 text-sm text-slate-600">{booking.review.comment}</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-3.5 space-y-3.5">
                <StarRating value={reviewRating} onChange={setReviewRating} />
                <textarea
                  rows={3}
                  placeholder={t('userBookingDetail.reviewPlaceholder')}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full rounded-2xl border-2 border-line bg-surface p-3.5 text-sm text-slate-900 outline-none transition-colors duration-300 placeholder:text-slate-400/70 focus:border-brand-500 focus:shadow-[0_0_0_5px_rgba(221,34,43,0.13)]"
                />
                <Button type="submit" disabled={!reviewRating || submittingReview}>
                  {submittingReview ? t('userBookingDetail.submittingReview') : t('userBookingDetail.submitReviewButton')}
                </Button>
              </form>
            )}
          </Card>
        </Section>
      )}
    </div>
  )
}
