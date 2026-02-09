'use client'

import { useLoanStore } from '@/lib/store/useLoanStore'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export function Step3Summary() {
  const { wizardData, loanAmount, termMonths, setCurrentStep } = useLoanStore()

  const finalSubmit = () => {
    alert('¡Solicitud enviada con éxito! (Simulación Frontend)')
    // Aquí irían las llamadas a la API GraphQL que creamos antes
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¡Todo Listo!</h2>
        <p className="text-gray-500">Revisa tu solicitud antes de enviar</p>
      </div>

      <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
        {/* Resumen del Crédito */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-blue-100 text-sm font-medium">Monto Solicitado</p>
              <p className="text-3xl font-bold">${loanAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm font-medium">Plazo</p>
              <p className="text-xl font-bold">{termMonths} Meses</p>
            </div>
          </div>
        </div>

        {/* Datos Personales */}
        <div className="p-6 space-y-4 text-sm divide-y divide-gray-100">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Nombre</span>
            <span className="font-medium text-gray-900">{wizardData.fullName}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{wizardData.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Documento</span>
            <span className="font-medium text-gray-900">{wizardData.idDocument}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Salario</span>
            <span className="font-medium text-green-600">${wizardData.salary.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Editar
        </button>
        
        <button
          onClick={finalSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1 transition-all"
        >
          Confirmar y Enviar Solicitud
        </button>
      </div>
    </div>
  )
}
