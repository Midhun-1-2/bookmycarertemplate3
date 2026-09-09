import { useTranslation } from 'react-i18next'

const OPTIONS = [7, 14, 30, 90]

export default function DayRangeSelect({ value, onChange }) {
  const { t } = useTranslation()
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 shrink-0 cursor-pointer rounded-full border border-line bg-slate-900/[0.03] px-3 text-[11px] font-semibold text-slate-600 outline-none transition-colors hover:border-line-strong focus:border-brand-500/60 [&>option]:bg-surface-2 [&>option]:text-slate-800"
    >
      {OPTIONS.map((d) => (
        <option key={d} value={d}>
          {t('charts.lastNDays', { days: d })}
        </option>
      ))}
    </select>
  )
}
