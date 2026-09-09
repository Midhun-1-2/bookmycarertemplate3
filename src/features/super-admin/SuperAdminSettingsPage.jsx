import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Settings } from 'lucide-react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { readStore, writeStore } from '../../lib/storage'

const DEFAULTS = {
  platformName: 'Book My Carer',
  supportPhone: '9000000000',
  supportEmail: 'support@bookmycarers.in',
  escrowProvider: 'To be confirmed by client',
  maintenanceMode: false,
}

export default function SuperAdminSettingsPage() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState(() => readStore('settings', DEFAULTS))
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    writeStore('settings', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/12 text-brand-700">
          <Settings size={19} />
        </span>
        {t('superAdminSettings.title')}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {t('superAdminSettings.subtitle')}
      </p>

      <Card className="mt-6" animate={false}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label={t('superAdminSettings.platformName')}
            value={settings.platformName}
            onChange={(e) => setSettings((s) => ({ ...s, platformName: e.target.value }))}
          />
          <Input
            label={t('superAdminSettings.supportPhone')}
            value={settings.supportPhone}
            onChange={(e) => setSettings((s) => ({ ...s, supportPhone: e.target.value }))}
          />
          <Input
            label={t('superAdminSettings.supportEmail')}
            value={settings.supportEmail}
            onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
          />
          <Input
            label={t('superAdminSettings.escrowProvider')}
            value={settings.escrowProvider}
            onChange={(e) => setSettings((s) => ({ ...s, escrowProvider: e.target.value }))}
          />

          <label className="flex cursor-pointer items-center gap-3 pt-1 text-sm font-medium text-slate-700">
            <span
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ${
                settings.maintenanceMode ? 'bg-brand-600' : 'bg-slate-900/[0.12]'
              }`}
            >
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings((s) => ({ ...s, maintenanceMode: e.target.checked }))}
                className="sr-only"
              />
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-[0_1px_3px_rgba(35,31,32,0.3)] transition-transform duration-300 ${
                  settings.maintenanceMode ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </span>
            {t('superAdminSettings.maintenanceMode')}
          </label>

          <Button type="submit">{saved ? <><CheckCircle2 size={16} /> {t('superAdminSettings.saved')}</> : t('superAdminSettings.saveButton')}</Button>
        </form>
      </Card>
    </div>
  )
}
