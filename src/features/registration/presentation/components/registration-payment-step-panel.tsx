import type { ChangeEvent } from 'react'
import type { FormikProps } from 'formik'
import { Link } from 'react-router-dom'

import { REGISTRATION_FEE_CLP, type RegistrationFormValues } from '@features/registration/domain/entities/registration'

const BANK_INFO = {
  bankName: 'Banco Estado',
  accountType: 'Cuenta Corriente',
  accountNumber: '62900281957',
  holderName: 'Union Femenina Aliancista',
  holderRut: '70017500-6',
  contactEmail: 'tesorera_ufa@acym.cl',
} as const

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

type PaymentStepPanelProps = {
  formik: FormikProps<RegistrationFormValues>
  totalAmount: number
  onReceiptChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
}

export function RegistrationPaymentStepPanel({
  formik,
  totalAmount,
  onReceiptChange,
}: Readonly<PaymentStepPanelProps>) {
  return (
    <section className="registration-panel" aria-labelledby="step-pago-title">
      <h3 id="step-pago-title" className="registration-panel-title">
        Pago y comprobante
      </h3>
      <p className="registration-panel-subtitle">
        Valor por participante: {currencyFormatter.format(REGISTRATION_FEE_CLP)}. Total a transferir:{' '}
        <strong>{currencyFormatter.format(totalAmount)}</strong>.
      </p>

      <div className="bank-card" role="note" aria-label="Datos bancarios">
        <p className="registration-bank-warning">
          Importante: solo se debe transferir a los datos de la cuenta de Banco Estado indicados a continuación.
        </p>
        <p>
          <strong>Banco:</strong> {BANK_INFO.bankName}
        </p>
        <p>
          <strong>Tipo de cuenta:</strong> {BANK_INFO.accountType}
        </p>
        <p>
          <strong>N de cuenta:</strong> {BANK_INFO.accountNumber}
        </p>
        <p>
          <strong>Titular:</strong> {BANK_INFO.holderName}
        </p>
        <p>
          <strong>RUT:</strong> {BANK_INFO.holderRut}
        </p>
        <p>
          <strong>Email:</strong> {BANK_INFO.contactEmail}
        </p>
      </div>

      <label className="registration-field" htmlFor="receiptFile">
        <span className="registration-label">Comprobante de pago (imagen)</span>
        <input
          id="receiptFile"
          name="receiptFile"
          type="file"
          accept="image/png,image/jpg,image/jpeg,image/webp,image/heic"
          onChange={onReceiptChange}
          className="registration-input registration-file-input"
        />
      </label>

      {formik.values.receiptFileName ? <p className="registration-file-name">Archivo cargado: {formik.values.receiptFileName}</p> : null}

      {formik.touched.receiptBase64 && formik.errors.receiptBase64 ? (
        <p className="registration-error">{formik.errors.receiptBase64}</p>
      ) : null}

      <div className="registration-consent-group">
        <label className="registration-checkbox-option" htmlFor="acceptsTerms">
          <input
            id="acceptsTerms"
            name="acceptsTerms"
            type="checkbox"
            checked={formik.values.acceptsTerms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span>Acepto los términos y condiciones de inscripción.</span>
        </label>
        {formik.touched.acceptsTerms && formik.errors.acceptsTerms ? <p className="registration-error">{formik.errors.acceptsTerms}</p> : null}

        <label className="registration-checkbox-option" htmlFor="acceptsImageAuthorization">
          <input
            id="acceptsImageAuthorization"
            name="acceptsImageAuthorization"
            type="checkbox"
            checked={formik.values.acceptsImageAuthorization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span>Autorizo el uso de mi imagen con fines promocionales, institucionales y de registro del ministerio UFA.</span>
        </label>
        {formik.touched.acceptsImageAuthorization && formik.errors.acceptsImageAuthorization ? (
          <p className="registration-error">{formik.errors.acceptsImageAuthorization}</p>
        ) : null}
      </div>

      <div className="registration-legal-note">
        <p>
          Al enviar la inscripción aceptas los <Link to="/terminos-y-condiciones">Terminos y Condiciones</Link> y la{' '}
          <Link to="/politica-de-privacidad">Politica de Privacidad</Link>.
        </p>
      </div>
    </section>
  )
}
