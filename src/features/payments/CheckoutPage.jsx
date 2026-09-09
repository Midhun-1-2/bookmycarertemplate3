import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CreditCard, Smartphone, Landmark, CheckCircle2, IndianRupee } from 'lucide-react'
import { bookingsApi, staffApi, payForBooking } from '../../lib/mockApi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/dashboard/PageHeader'
import { SPRING_BOUNCY } from '../../lib/motion'

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { bookingId } = useParams()

  const METHODS = [
    { id: 'upi', label: t('checkout.methodUpi'), icon: Smartphone },
    { id: 'card', label: t('checkout.methodCard'), icon: CreditCard },
    { id: 'netbanking', label: t('checkout.methodNetbanking'), icon: Landmark },
  ]
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [staffName, setStaffName] = useState('')
  const [method, setMethod] = useState('upi')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    async function load() {
      const b = await bookingsApi.get(bookingId)
      setBooking(b)
      if (b?.staffId) {
        const s = await staffApi.get(b.staffId)
        setStaffName(s?.name ?? '')
      }
    }
    load()
  }, [bookingId])

  async function handlePay() {
    setStatus('processing')
    await new Promise((r) => setTimeout(r, 1400))
    await payForBooking(bookingId, booking.payment.amount)
    setStatus('success')
  }

  if (!booking) return null

  return (
    <div className="mx-auto max-w-md px-5 py-12 sm:px-8">
      <PageHeader title={t('checkout.title')} subtitle={t('checkout.subtitle')} />

      <Card className="mt-2" animate={false}>
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{booking.serviceName}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {t('checkout.caregiverLabel', { name: staffName || t('checkout.assignedFallback') })}
            </p>
          </div>
          <p className="flex items-center font-display text-lg font-bold text-brand-700">
            <IndianRupee size={16} />
            {booking.payment.amount}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={SPRING_BOUNCY}
              className="flex flex-col items-center py-7 text-center"
            >
              <motion.span
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ ...SPRING_BOUNCY, delay: 0.1 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-500"
              >
                <CheckCircle2 size={40} />
              </motion.span>
              <p className="mt-4 text-lg font-bold text-slate-900">
                {t('checkout.paymentSuccessful')}
              </p>
              <p className="mt-1.5 text-sm text-slate-500">{t('checkout.successMessage')}</p>
              <Button className="mt-6 w-full" onClick={() => navigate(`/user/bookings/${bookingId}`)}>
                {t('checkout.viewBooking')}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                {t('checkout.choosePaymentMethod')}
              </p>
              <div className="space-y-2.5">
                {METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all duration-300 ${
                      method === id
                        ? 'border-brand-500 bg-brand-500/[0.06] text-brand-700 shadow-[0_0_0_5px_rgba(221,34,43,0.1)]'
                        : 'border-line text-slate-600 hover:border-line-strong hover:bg-slate-900/[0.025]'
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                ))}
              </div>
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handlePay}
                disabled={status === 'processing'}
              >
                {status === 'processing'
                  ? t('checkout.processing')
                  : t('checkout.payAmount', { amount: booking.payment.amount })}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
