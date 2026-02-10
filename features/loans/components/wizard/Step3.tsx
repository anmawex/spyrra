'use client'

import { useState } from 'react'
import { useLoanStore } from '@/features/loans/store/useLoanStore'
import { CheckCircle, ArrowLeft, Loader2, AlertCircle, XCircle } from 'lucide-react'

// Mutación en formato texto plano (No necesitamos gql tag ni dependencias)
const SUBMIT_LOAN_QUERY = `
  mutation SubmitLoanApplication($input: SubmitLoanInput!) {
    submitLoanApplication(input: $input) {
      success
      status
      message
      interestRate
      monthlyPayment
      totalPayment
      creditRequestId
    }
  }
`

export function Step3Summary() {
  const { wizardData, loanAmount, termMonths, setCurrentStep } = useLoanStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleFinalSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: SUBMIT_LOAN_QUERY,
          variables: {
            input: {
              fullName: wizardData.fullName,
              email: wizardData.email,
              phone: wizardData.phone,
              salary: wizardData.salary,
              idDocument: wizardData.idDocument,
              idIssueDate: new Date(wizardData.idIssueDate).toISOString(),
              amount: loanAmount,
              termMonths: termMonths,
            },
          },
        }),
      })

      const json = await response.json()

      if (json.errors) {
        throw new Error(json.errors[0]?.message || 'Error desconocido del servidor')
      }

      setResult(json.data.submitLoanApplication)
    } catch (err: any) {
      console.error('Error submitting loan:', err)
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // --- Renderizado de Resultados (Aprobado/Rechazado) ---
  if (result) {
    const isApproved = result.status === 'approved' || result.status === 'in_review'
    
    return (
      <div className="text-center space-y-6 animate-fadeIn py-8">
        <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
          isApproved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {isApproved ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900">
          {isApproved ? '¡Solicitud Exitosa!' : 'Solicitud Rechazada'}
        </h2>
        
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          {result.message}
        </p>

        {isApproved && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 max-w-sm mx-auto shadow-sm">
            <h3 className="font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-2">Tu Plan Aprobado</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Tasa Mensual</span>
                <span className="font-bold text-blue-900">{result.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Cuota Fija Aprox.</span>
                <span className="font-bold text-blue-900 text-lg">
                  ${result.monthlyPayment?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => window.location.reload()} 
          className="mt-8 text-blue-600 hover:text-blue-800 font-medium underline"
        >
          Iniciar Nueva Solicitud
        </button>
      </div>
    )
  }

  // --- Renderizado Normal (Resumen) ---
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Confirmar Datos</h2>
        <p className="text-gray-500">Todo listo para enviar tu solicitud</p>
      </div>

      {/* Tarjeta de Resumen */}
      <div className="bg-white border rounded-xl shadow-lg overflow-hidden divide-y divide-gray-100">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">Monto</p>
              <p className="text-3xl font-bold">${loanAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">Plazo</p>
              <p className="text-xl font-bold">{termMonths} Meses</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Nombre</span>
            <span className="font-medium text-gray-900">{wizardData.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Documento</span>
            <span className="font-medium text-gray-900">{wizardData.idDocument}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ingresos Mensuales</span>
            <span className="font-medium text-green-600">${wizardData.salary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fecha Expedición</span>
            <span className="font-medium text-gray-900">{wizardData.idIssueDate}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Error al enviar:</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          Editar
        </button>
        
        <button
          onClick={handleFinalSubmit}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            'Confirmar Solicitud'
          )}
        </button>
      </div>
    </div>
  )
}
