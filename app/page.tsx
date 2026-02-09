'use client'

import { CreditSlider } from '@/components/ui/CreditSlider'
import dynamic from 'next/dynamic'
import { Step1PersonalInfo } from '@/components/wizard/Step1'
import { Step2Identity } from '@/components/wizard/Step2'

// Importación dinámica para evitar conflictos de SSR con Apollo Client
const Step3Summary = dynamic(() => import('@/components/wizard/Step3').then(mod => mod.Step3Summary), { 
  ssr: false,
  loading: () => <div className="p-8 text-center text-gray-400">Cargando resumen...</div>
})
import { useLoanStore } from '@/lib/store/useLoanStore'
import { CheckCircle, CircleDot, Circle } from 'lucide-react'

// Componente para la barra de progreso
const WizardHeader = ({ step }: { step: number }) => {
  const steps = [
    { num: 1, label: 'Datos Personales' },
    { num: 2, label: 'Validación' },
    { num: 3, label: 'Confirmación' },
  ]

  return (
    <div className="flex justify-between items-center mb-12">
      {steps.map((s, idx) => (
        <div key={s.num} className="flex flex-col items-center flex-1 relative">
          {/* Línea conectora */}
          {idx < 2 && (
            <div className={`absolute top-4 left-1/2 w-full h-[2px] transition-colors duration-500 ease-in-out ${
              step > s.num ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}

          {/* Círculo indicador */}
          <div className={`
            relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
            ${step >= s.num 
              ? 'bg-blue-600 text-white shadow-blue-500/30 shadow-lg scale-110' 
              : 'bg-white text-gray-400 border-2 border-gray-200'}
          `}>
             {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
          </div>
          
          <span className={`mt-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
            step >= s.num ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { currentStep } = useLoanStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header Visual */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          Tu crédito en minutos
        </h1>
        <p className="text-lg text-gray-600">
          Sin papeleos, sin filas. Dinero rápido y seguro directo a tu cuenta bancaria.
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Columna Izquierda: Slider (Siempre visible) */}
        <div className="lg:sticky lg:top-8 animate-slideInLeft">
          <CreditSlider />
          
          {/* Beneficios Rápidos (Micro-copy) */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-white/40 shadow-sm">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Aprobación Inmediata</h4>
                <p className="text-xs text-gray-500 mt-1">Respuesta en 5 minutos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-white/40 shadow-sm">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Sin Codeudor</h4>
                <p className="text-xs text-gray-500 mt-1">Solo con tu cédula</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Wizard (Cambia según el paso) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100 animate-slideInRight">
          <WizardHeader step={currentStep} />
          
          <div className="min-h-[400px]">
            {currentStep === 1 && <Step1PersonalInfo />}
            {currentStep === 2 && <Step2Identity />}
            {currentStep === 3 && <Step3Summary />}
          </div>
        </div>
      </div>
    </div>
  )
}
