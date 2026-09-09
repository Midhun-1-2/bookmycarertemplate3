import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Archive, CheckCircle2, ExternalLink, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { servicePagesApi, categoriesApi } from '../../lib/mockApi'
import { Table, TableHead, TableBody, Th, Td, Tr } from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/dashboard/PageHeader'

const PAGE_STATUS_LABELS = {
  draft: 'adminServicePages.statusDraft',
  published: 'adminServicePages.statusPublished',
}

const fieldClass =
  'h-11 w-full rounded-2xl border-2 border-line bg-surface px-4 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-slate-400/70 hover:border-line-strong focus:border-brand-500 focus:shadow-[0_0_0_5px_rgba(221,34,43,0.13)] disabled:cursor-not-allowed disabled:border-line disabled:bg-slate-900/[0.03] disabled:text-slate-400'

const pillFieldClass =
  'h-10 w-full min-w-0 rounded-full border-2 border-line bg-surface px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400/70 hover:border-line-strong focus:border-brand-500'

const emptyPricingRow = () => ({ label: 'Hourly', price: '', unit: '/ hr' })

const emptyForm = {
  categoryId: '',
  serviceId: '',
  slug: '',
  title: '',
  shortDescription: '',
  description: '',
  features: '',
  requirements: '',
  pricing: [emptyPricingRow()],
}

export default function AdminServicePagesPage() {
  const { t } = useTranslation()
  const [pages, setPages] = useState(null)
  const categories = categoriesApi.listSync()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const categoryServices = categories.find((c) => c.id === form.categoryId)?.services ?? []

  async function load() {
    setPages(await servicePagesApi.list())
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setOpen(true)
  }

  function openEdit(page) {
    setForm({
      categoryId: page.categoryId,
      serviceId: page.serviceId,
      slug: page.slug,
      title: page.title,
      shortDescription: page.shortDescription,
      description: page.description,
      features: page.features.join(', '),
      requirements: page.requirements.join(', '),
      pricing: page.pricing?.length
        ? page.pricing.map((p) => ({ label: p.label, price: String(p.price), unit: p.unit }))
        : [emptyPricingRow()],
    })
    setEditingId(page.id)
    setOpen(true)
  }

  function handleCategoryChange(categoryId) {
    setForm((f) => ({ ...f, categoryId, serviceId: '', title: '' }))
  }

  function handleServiceChange(serviceId) {
    const svc = categoryServices.find((s) => s.id === serviceId)
    setForm((f) => ({ ...f, serviceId, title: svc?.name ?? '' }))
  }

  function updatePricingRow(index, field, value) {
    setForm((f) => ({
      ...f,
      pricing: f.pricing.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  function addPricingRow() {
    setForm((f) => ({ ...f, pricing: [...f.pricing, emptyPricingRow()] }))
  }

  function removePricingRow(index) {
    setForm((f) => ({ ...f, pricing: f.pricing.filter((_, i) => i !== index) }))
  }

  async function handleSave(e) {
    e.preventDefault()
    const payload = {
      categoryId: form.categoryId,
      serviceId: form.serviceId,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split(',').map((s) => s.trim()).filter(Boolean),
      pricing: form.pricing
        .filter((p) => p.label && p.price !== '')
        .map((p) => ({ label: p.label, price: Number(p.price), unit: p.unit || '/ hr' })),
      updatedAt: new Date().toISOString(),
    }

    if (editingId) {
      await servicePagesApi.update(editingId, payload)
    } else {
      await servicePagesApi.create({ id: `page-${Date.now()}`, status: 'draft', ...payload })
    }
    setOpen(false)
    load()
  }

  async function toggleStatus(page) {
    await servicePagesApi.update(page.id, {
      status: page.status === 'published' ? 'draft' : 'published',
    })
    load()
  }

  if (!pages) return null

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageHeader title={t('adminServicePages.title')} subtitle={t('adminServicePages.subtitle')} />
        </div>
        <Button className="w-full sm:w-auto" onClick={openCreate}>
          <Plus size={17} />
          {t('adminServicePages.newPage')}
        </Button>
      </div>

      <div className="mt-6">
        <Table>
          <TableHead>
            <Th>{t('adminServicePages.colTitle')}</Th>
            <Th>{t('adminServicePages.colCategory')}</Th>
            <Th>{t('adminServicePages.colStatus')}</Th>
            <Th>{t('adminServicePages.colUpdated')}</Th>
            <Th>{t('adminServicePages.colActions')}</Th>
          </TableHead>
          <TableBody>
            {pages.map((page, i) => {
              const cat = categories.find((c) => c.id === page.categoryId)
              return (
                <Tr key={page.id} index={i}>
                  <Td className="font-medium text-slate-800">{page.title}</Td>
                  <Td>{cat?.name ?? '—'}</Td>
                  <Td>
                    <Badge tone={page.status === 'published' ? 'success' : 'neutral'}>{t(PAGE_STATUS_LABELS[page.status])}</Badge>
                  </Td>
                  <Td className="tabular-nums">{new Date(page.updatedAt).toLocaleDateString()}</Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(page)}
                        className="cursor-pointer rounded-full border border-line bg-slate-900/[0.03] p-1.5 text-slate-400 transition-colors hover:border-brand-500/40 hover:text-brand-600"
                        aria-label={t('adminServicePages.edit')}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => toggleStatus(page)}
                        className="cursor-pointer rounded-full border border-line bg-slate-900/[0.03] p-1.5 text-slate-400 transition-colors hover:border-brand-500/40 hover:text-brand-600"
                        aria-label={t('adminServicePages.toggleStatus')}
                      >
                        {page.status === 'published' ? <Archive size={14} /> : <CheckCircle2 size={14} />}
                      </button>
                      {cat && (
                        <Link
                          to={`/services/${cat.slug}/${page.serviceId}`}
                          target="_blank"
                          className="rounded-full border border-line bg-slate-900/[0.03] p-1.5 text-slate-400 transition-colors hover:border-brand-500/40 hover:text-brand-600"
                          aria-label={t('adminServicePages.preview')}
                        >
                          <ExternalLink size={14} />
                        </Link>
                      )}
                    </div>
                  </Td>
                </Tr>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editingId ? t('adminServicePages.editModalTitle') : t('adminServicePages.newModalTitle')} className="max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">{t('adminServicePages.category')}</p>
            <select
              required
              value={form.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`${fieldClass} cursor-pointer [&>option]:bg-surface-2 [&>option]:text-slate-800`}
            >
              <option value="">{t('adminServicePages.selectCategory')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">{t('adminServicePages.pageTitle')}</p>
            <select
              required
              disabled={!form.categoryId}
              value={form.serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className={`${fieldClass} cursor-pointer [&>option]:bg-surface-2 [&>option]:text-slate-800`}
            >
              <option value="">{t('adminServicePages.selectService')}</option>
              {categoryServices.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <Input label={t('adminServicePages.shortDescription')} value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} />
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">{t('adminServicePages.fullDescription')}</p>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`${fieldClass} h-auto rounded-[20px] py-3`}
            />
          </div>
          <Input label={t('adminServicePages.featuresCommaSeparated')} value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} />
          <Input label={t('adminServicePages.requirementsCommaSeparated')} value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">{t('adminServicePages.pricingTiers')}</p>
              <button
                type="button"
                onClick={addPricingRow}
                className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
              >
                <Plus size={13} /> {t('adminServicePages.addPriceTier')}
              </button>
            </div>
            <div className="space-y-2">
              {form.pricing.map((row, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    placeholder={t('adminServicePages.priceLabel')}
                    value={row.label}
                    onChange={(e) => updatePricingRow(i, 'label', e.target.value)}
                    className={`${pillFieldClass} sm:flex-1`}
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder={t('adminServicePages.priceInr')}
                      type="number"
                      value={row.price}
                      onChange={(e) => updatePricingRow(i, 'price', e.target.value)}
                      className={`${pillFieldClass} flex-1 sm:w-20 sm:flex-none`}
                    />
                    <input
                      placeholder={t('adminServicePages.unit')}
                      value={row.unit}
                      onChange={(e) => updatePricingRow(i, 'unit', e.target.value)}
                      className={`${pillFieldClass} flex-1 sm:w-20 sm:flex-none`}
                    />
                    {form.pricing.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePricingRow(i)}
                        className="shrink-0 cursor-pointer rounded-full p-1.5 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                        aria-label={t('adminServicePages.removePriceTier')}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {editingId ? t('adminServicePages.saveChanges') : t('adminServicePages.createPageDraft')}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
