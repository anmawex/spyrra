'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoanStore } from '@/features/loans/store/useLoanStore'
import { personalInfoSchema, PersonalInfoInputs } from '@/features/loans/logic/validators'
import { Button } from '@/components/ui/Button' // Asumimos un componente base
import clsx from 'clsx'

export function Step1PersonalInfo() {
  const { wizardData, updateWizardData, setCurrentStep } = useLoanStore()
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm<PersonalInfoInputs>({
    resolver: zodResolver(personalInfoSchema) as any,
    defaultValues: {
      fullName: wizardData.fullName,
      email: wizardData.email,
      phone: wizardData.phone,
      salary: wizardData.salary || 0,
    },
    mode: 'onTouched' // Valida al perder foco
  })

  // Al enviar, guardamos en Zustand y avanzamos
  const onSubmit: SubmitHandler<PersonalInfoInputs> = (data) => {
    updateWizardData(data)
    setCurrentStep(2)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Datos Personales</h3>
        
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input 
            {...register('fullName')}
            className={clsx(
              "mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors",
              errors.fullName ? "border-red-500 focus:border-red-500" : "border-gray-300"
            )}
            placeholder="Ej: Juan Pérez"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input 
            {...register('email')}
            type="email"
            className={clsx(
              "mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors",
              errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300"
            )}
            placeholder="juan@ejemplo.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Celular</label>
          <input 
            {...register('phone')}
            type="tel"
            className={clsx(
              "mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors",
              errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300"
            )}
            placeholder="+57 300 123 4567"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Salario Mensual</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              {...register('salary', { valueAsNumber: true })} // Forzar número
              type="number"
              className={clsx(
                "block w-full rounded-md border pl-7 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors",
                errors.salary ? "border-red-500 focus:border-red-500" : "border-gray-300"
              )}
              placeholder="0.00"
            />
          </div>
          {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={!isValid}
          className={clsx(
            "w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 shadow-md",
            isValid 
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5" 
              : "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
          )}
        >
          Siguiente Paso →
        </Button>
      </div>
    </form>
  )
}
