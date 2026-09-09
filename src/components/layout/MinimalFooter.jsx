import { useTranslation } from 'react-i18next'

export default function MinimalFooter() {
  const { t } = useTranslation()
  return (
    <footer className="mt-auto border-t border-line px-5 py-5 text-center sm:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400/70">
        {t('footer.poweredBy')}
      </p>
    </footer>
  )
}
