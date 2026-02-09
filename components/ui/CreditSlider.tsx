'use client'

import { useLoanStore } from '@/lib/store/useLoanStore'
import { Banknote, Clock, Percent } from 'lucide-react'

// Utilidad para formatear dinero
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function CreditSlider() {
  const { loanAmount, setLoanAmount, termMonths, setTermMonths } = useLoanStore()
  
  // Rango: $500.000 a $20.000.000
  const MIN_AMOUNT = 500000
  const MAX_AMOUNT = 20000000
  const STEP_AMOUNT = 100000

  // Plazos: 6, 12, 18, 24, 36, 48 meses
  const TERMS = [6, 12, 18, 24, 36, 48]
  
  // Cálculo simple de cuota (interés del 2.5% mensual fijo para visualización)
  const monthlyRate = 0.025
  const estimatedMonthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))

  
  return (
    <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 space-y-8">
      {/* Header del Slider */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Calcula tu Préstamo
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Elige el monto y plazo ideal para ti
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-full text-blue-600 shadow-inner">
          <Banknote className="w-8 h-8" />
        </div>
      </div>

      {/* Monto Slider */}
      <div className="space-y-4">
        <label className="flex justify-between items-center text-sm font-medium text-gray-700">
          <span>Monto Solicitado</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(loanAmount)}
          </span>
        </label>
        
        <input
          type="range"
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          step={STEP_AMOUNT}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        />
        
        <div className="flex justify-between text-xs text-gray-400 font-medium">
          <span>{formatCurrency(MIN_AMOUNT)}</span>
          <span>{formatCurrency(MAX_AMOUNT)}</span>
        </div>
      </div>

      {/* Plazo Selector (Pill Design) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>Elige tu Plazo</span>
          </div>
          <span className="text-blue-600 font-bold">{termMonths} Meses</span>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {TERMS.map((term) => (
            <button
              key={term}
              onClick={() => setTermMonths(term)}
              className={`
                py-2 px-1 rounded-lg text-sm font-semibold transition-all duration-200
                ${termMonths === term 
                  ? 'bg-blue-600 text-white shadow-lg scale-105 transform' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}
              `}
            >
              {term}m
            </button>
          ))}
        </div>
      </div>

      {/* Resumen de Cuota */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500 font-medium">Cuota Mensual Estimada</p>
            <div className="flex items-center gap-2 mt-1">
              <Percent className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                Tasa 2.5% M.V.
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-3xl font-extrabold text-gray-900">
              {formatCurrency(estimatedMonthlyPayment)}
            </span>
            <span className="text-xs text-gray-400">*Sujeto a aprobación de crédito</span>
          </div>
        </div>
      </div>
    </div>
  )
}
