import { useMemo } from 'react'
import type { FormikProps } from 'formik'

import { MAX_COMPANIONS, type RegistrationFormValues } from '@features/registration/domain/entities/registration'
import { DISTRICT_NAMES, getChurchesByDistrict } from '@features/registration/domain/entities/church-directory'

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

type CountStepPanelProps = {
  formik: FormikProps<RegistrationFormValues>
  companionCount: number
  totalParticipants: number
  totalAmount: number
  setCompanionCount: (value: unknown) => void
}

export function RegistrationCountStepPanel({
  formik,
  companionCount,
  totalParticipants,
  totalAmount,
  setCompanionCount,
}: Readonly<CountStepPanelProps>) {
  const churches = useMemo(() => getChurchesByDistrict(formik.values.districtName), [formik.values.districtName])

  return (
    <section className="registration-panel" aria-labelledby="step-cantidad-title">
      <h3 id="step-cantidad-title" className="registration-panel-title">
        Define cuantas personas se inscribiran contigo
      </h3>
      <p className="registration-panel-subtitle">
        Puedes agregar hasta {MAX_COMPANIONS} personas adicionales. El primer formulario siempre sera para ti.
      </p>

      <label className="registration-field" htmlFor="districtName">
        <span className="registration-label">Distrito</span>
        <select
          id="districtName"
          name="districtName"
          value={formik.values.districtName}
          onChange={(event) => {
            const nextDistrict = event.currentTarget.value
            formik.setFieldValue('districtName', nextDistrict, false)
            formik.setFieldValue('churchOrigin', '', false)
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
        >
          <option value="">Selecciona un distrito</option>
          {DISTRICT_NAMES.map((districtName) => (
            <option key={districtName} value={districtName}>
              {districtName}
            </option>
          ))}
        </select>
      </label>

      {formik.touched.districtName && formik.errors.districtName ? (
        <p className="registration-error">{formik.errors.districtName}</p>
      ) : null}

      <label className="registration-field" htmlFor="churchOrigin">
        <span className="registration-label">Iglesia de origen</span>
        <input
          id="churchOrigin"
          name="churchOrigin"
          type="text"
          value={formik.values.churchOrigin}
          onChange={(event) => {
            formik.setFieldValue('churchOrigin', event.currentTarget.value, false)
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
          placeholder={formik.values.districtName ? 'Busca y selecciona tu iglesia' : 'Primero selecciona un distrito'}
          autoComplete="organization"
          list="church-origin-list"
          disabled={!formik.values.districtName}
        />
        <datalist id="church-origin-list">
          {churches.map((church) => (
            <option key={church} value={church} />
          ))}
        </datalist>
      </label>

      {formik.touched.churchOrigin && formik.errors.churchOrigin ? (
        <p className="registration-error">{formik.errors.churchOrigin}</p>
      ) : null}

      <label className="registration-field" htmlFor="companionCount">
        <span className="registration-label">Personas adicionales</span>
        <select
          id="companionCount"
          name="companionCount"
          value={companionCount}
          onChange={(event) => {
            setCompanionCount(event.currentTarget.value)
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
        >
          <option value={0}>Solo yo</option>
          <option value={1}>Yo + 1 persona</option>
          <option value={2}>Yo + 2 personas</option>
          <option value={3}>Yo + 3 personas</option>
          <option value={4}>Yo + 4 personas</option>
        </select>
      </label>

      {formik.touched.companionCount && formik.errors.companionCount ? (
        <p className="registration-error">{formik.errors.companionCount}</p>
      ) : null}

      <output className="registration-summary-strip">
        <p>Total de participantes: {totalParticipants}</p>
        <p>Total estimado: {currencyFormatter.format(totalAmount)}</p>
      </output>
    </section>
  )
}
