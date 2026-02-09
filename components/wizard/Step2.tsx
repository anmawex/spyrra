'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoanStore } from '@/lib/store/useLoanStore'
import { identitySchema, IdentityInputs } from '@/lib/validators'
import clsx from 'clsx'

export function Step2Identity() {
  const { wizardData, updateWizardData, setCurrentStep } = useLoanStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<IdentityInputs>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      idDocument: wizardData.idDocument,
      idIssueDate: wizardData.idIssueDate,
    },
    mode: 'onTouched'
  })

  const onSubmit = (data: IdentityInputs) => {
    updateWizardData(data)
    setCurrentStep(3)
  }

  // Estilo base para Input (similar al componente UI)
  const inputClass = clsx(
    "mt-1 block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none hover:bg-white"
  )

  const errorClass = "mt-1 text-sm text-red-500 font-medium animate-pulse"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fadeIn">
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Identificación Oficial</h3>
        </div>

        {/* Documento */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
            Número de Cédula
          </label>
          <input
            {...register('idDocument')}
            type="text"
            className={clsx(inputClass, errors.idDocument ? "border-red-300 ring-red-100" : "border-gray-200")}
            placeholder="Ej: 1020304050"
          />
          {errors.idDocument && <p className={errorClass}>{errors.idDocument.message}</p>}
        </div>

        {/* Fecha de Expedición */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
            Fecha de Expedición
          </label>
          <input
            {...register('idIssueDate')}
            type="date"
            className={clsx(inputClass, errors.idIssueDate ? "border-red-300 ring-red-100" : "border-gray-200")}
          />
          {errors.idIssueDate && <p className={errorClass}>{errors.idIssueDate.message}</p>}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-8">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Atrás
        </button>
        
        <button
          type="submit"
          disabled={!isValid}
          className={clsx(
            "px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center gap-2",
            isValid
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 hover:scale-105 active:scale-95"
              : "bg-gray-300 cursor-not-allowed shadow-none grayscale"
          )}
        >
          Revisar Resumen
          {isValid && <span className="text-xl">→</span>}
        </button>
      </div>
    </form>
  )
}
