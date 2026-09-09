import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { getChatThread, sendChatMessage } from '../../lib/mockApi'
import { EASE_OUT_EXPO } from '../../lib/motion'

export default function CaregiverChatModal({ staff, userId, userName, open, onClose }) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (open && staff) {
      setText('')
      setLoading(true)
      getChatThread(staff.id, userId).then((msgs) => {
        setMessages(msgs)
        setLoading(false)
      })
    }
  }, [open, staff?.id, userId])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setSending(true)
    const message = await sendChatMessage({ staffId: staff.id, userId, userName, from: 'user', text: trimmed })
    setMessages((m) => [...m, message])
    setText('')
    setSending(false)
  }

  if (!staff) return null

  return (
    <Modal open={open} onClose={onClose} title={t('booking.chatWithCaregiver', { name: staff.name })}>
      <div ref={listRef} className="flex max-h-80 min-h-[10rem] flex-col gap-2.5 overflow-y-auto pr-1">
        {loading ? (
          <p className="my-auto text-center text-sm text-slate-400">{t('booking.chatLoading')}</p>
        ) : messages.length === 0 ? (
          <p className="my-auto text-center text-sm text-slate-400">
            {t('booking.chatEmptyState', { name: staff.name.split(' ')[0] })}
          </p>
        ) : (
          messages.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO, delay: Math.min(i * 0.02, 0.2) }}
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.from === 'user'
                  ? 'self-end bg-gradient-to-br from-brand-500 to-brand-600 text-white'
                  : 'self-start bg-slate-900/[0.04] text-slate-700'
              }`}
            >
              {m.text}
            </motion.div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('booking.chatPlaceholder')}
          className="h-12 flex-1 rounded-2xl border-2 border-line bg-surface px-4 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-slate-400/70 hover:border-line-strong focus:border-brand-500 focus:shadow-[0_0_0_5px_rgba(221,34,43,0.13)]"
        />
        <Button type="submit" size="md" disabled={!text.trim() || sending} aria-label={t('booking.chatSend')}>
          <Send size={16} />
        </Button>
      </form>
      <p className="mt-3 text-center text-[11px] text-slate-400">{t('booking.chatDisclaimer')}</p>
    </Modal>
  )
}
