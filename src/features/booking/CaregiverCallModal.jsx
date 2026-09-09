import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PhoneOff } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { SPRING_BOUNCY, floatLoop } from '../../lib/motion'

export default function CaregiverCallModal({ staff, open, onClose }) {
  const { t } = useTranslation()
  const [connected, setConnected] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!open) {
      setConnected(false)
      setSeconds(0)
      return
    }
    const connectTimer = setTimeout(() => setConnected(true), 1800)
    return () => clearTimeout(connectTimer)
  }, [open])

  useEffect(() => {
    if (!connected) return
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [connected])

  if (!staff) return null

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <Modal open={open} onClose={onClose} className="max-w-xs">
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <motion.div
          {...(connected ? {} : floatLoop)}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING_BOUNCY}
          className="flex h-17 w-17 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-[0_12px_28px_-12px_rgba(221,34,43,0.6)]"
        >
          {staff.name.split(' ').map((n) => n[0]).join('')}
        </motion.div>
        <p className="text-base font-bold text-slate-900">{staff.name}</p>
        <p className="text-sm text-slate-500">{connected ? `${mm}:${ss}` : t('booking.calling')}</p>
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={SPRING_BOUNCY}
          className="mt-2 flex h-13 w-13 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-[0_10px_24px_-10px_rgba(165,17,27,0.7)]"
          aria-label={t('booking.endCall')}
        >
          <PhoneOff size={20} />
        </motion.button>
        <p className="mt-1 text-[11px] text-slate-400">{t('booking.callDisclaimer')}</p>
      </div>
    </Modal>
  )
}
