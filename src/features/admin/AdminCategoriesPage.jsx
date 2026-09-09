import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { categoriesApi } from '../../lib/mockApi'
import { getCategoryIcon } from '../../lib/icons'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import PageHeader from '../../components/dashboard/PageHeader'

const ICONS = [
  'Stethoscope',
  'Activity',
  'HeartHandshake',
  'HandHeart',
  'Baby',
  'Brain',
  'Leaf',
  'PawPrint',
]
const emptyCategory = { name: '', description: '', icon: 'HeartHandshake' }

export default function AdminCategoriesPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyCategory)
  const [serviceDrafts, setServiceDrafts] = useState({})

  async function load() {
    setCategories(await categoriesApi.list())
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAddCategory(e) {
    e.preventDefault()
    await categoriesApi.create({
      id: `cat-${Date.now()}`,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: form.name,
      description: form.description,
      icon: form.icon,
      services: [],
    })
    setForm(emptyCategory)
    setOpen(false)
    load()
  }

  async function handleAddService(cat) {
    const draft = serviceDrafts[cat.id]
    if (!draft?.name) return
    await categoriesApi.update(cat.id, {
      services: [...cat.services, { id: `svc-${Date.now()}`, name: draft.name }],
    })
    setServiceDrafts((d) => ({ ...d, [cat.id]: { name: '' } }))
    load()
  }

  async function handleRemoveService(cat, serviceId) {
    await categoriesApi.update(cat.id, {
      services: cat.services.filter((s) => s.id !== serviceId),
    })
    load()
  }

  if (!categories) return null

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageHeader title={t('adminCategories.title')} subtitle={t('adminCategories.subtitle')} />
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>
          <Plus size={17} />
          {t('adminCategories.addCategory')}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon)
          const draft = serviceDrafts[cat.id] ?? { name: '' }
          return (
            <Card key={cat.id} animate={false}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/12 text-brand-700">
                  <Icon size={19} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>
              </div>

              <ul className="mt-4 divide-y divide-line/70 border-t border-line/60">
                {cat.services.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-slate-700">{s.name}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRemoveService(cat, s.id)}
                        className="cursor-pointer rounded-full p-1 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                        aria-label={t('adminCategories.removeService')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder={t('adminCategories.newServiceName')}
                  value={draft.name}
                  onChange={(e) =>
                    setServiceDrafts((d) => ({ ...d, [cat.id]: { ...draft, name: e.target.value } }))
                  }
                  className="h-10 w-full rounded-full border-2 border-line bg-surface px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400/70 hover:border-line-strong focus:border-brand-500 sm:flex-1"
                />
                <Button size="sm" variant="outline" className="shrink-0" onClick={() => handleAddService(cat)}>
                  <Plus size={14} /> {t('adminCategories.add')}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t('adminCategories.modalTitle')}>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label={t('adminCategories.categoryName')}
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label={t('adminCategories.description')}
            required
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">{t('adminCategories.icon')}</p>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((iconName) => {
                const Icon = getCategoryIcon(iconName)
                return (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => setForm((f) => ({ ...f, icon: iconName }))}
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border-2 transition-colors ${
                      form.icon === iconName
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-line text-brand-700 hover:bg-brand-500/[0.06]'
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                )
              })}
            </div>
          </div>
          <Button type="submit" className="w-full">
            {t('adminCategories.addCategory')}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
