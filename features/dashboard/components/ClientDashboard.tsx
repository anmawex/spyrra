'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { CreditCard, Calendar, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'

// --- Tipos ---
interface PaymentInstallment {
  id: string
  installmentNumber: number
  dueDate: string
  amount: number
  status: string
  paidDate: string | null
}

interface CreditRequest {
  id: string
  amount: number
  termMonths: number
  status: string
  interestRate: number
  paymentInstallments: PaymentInstallment[]
}

interface UserData {
  id: string
  name: string
  email: string
  creditRequests: CreditRequest[]
}

// --- Queries ---
const GET_USER_DATA = `
  query GetUserData($email: String!) {
    userByEmail(email: $email) {
      id
      name
      email
      creditRequests {
        id
        amount
        termMonths
        status
        interestRate
        paymentInstallments {
          id
          installmentNumber
          dueDate
          amount
          status
          paidDate
        }
      }
    }
  }
`

const PAY_INSTALLMENT_MUTATION = `
  mutation PayInstallment($id: ID!) {
    payInstallment(id: $id) {
      id
      status
      paidDate
    }
  }
`

export function ClientDashboard() {
  const [email, setEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [payingId, setPayingId] = useState<string | null>(null)

  // Función para cargar datos
  const fetchUserData = async (targetEmail: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: GET_USER_DATA,
          variables: { email: targetEmail }
        })
      })
      const json = await res.json()
      
      if (json.errors) throw new Error(json.errors[0].message)
      if (!json.data.userByEmail) throw new Error('Usuario no encontrado. ¿Ya solicitaste tu crédito?')

      setUserData(json.data.userByEmail)
      setIsLoggedIn(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    fetchUserData(email)
  }

  const handlePay = async (installmentId: string) => {
    setPayingId(installmentId)
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: PAY_INSTALLMENT_MUTATION,
          variables: { id: installmentId }
        })
      })
      const json = await res.json()
      if (json.errors) throw new Error(json.errors[0].message)
      
      // Recargar datos para actualizar la UI
      if (userData) fetchUserData(userData.email)
      
    } catch (err: any) {
      alert('Error al pagar: ' + err.message)
    } finally {
      setPayingId(null)
    }
  }

  // --- Vista Login ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
        <div className="absolute top-4 left-4">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-gray-100">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al Inicio</span>
          </Link>
        </div>

        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Acceso Clientes</h1>
            <p className="text-gray-500 mt-2">Ingresa tu email para ver tus créditos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Registrado</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="ejemplo@email.com"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-3 text-lg" disabled={loading}>
              {loading ? 'Buscando...' : 'Ver Mis Créditos'}
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-400">
            <p>Tip: Usa el email con el que pediste el crédito</p>
          </div>
        </div>
      </div>
    )
  }

  // --- Vista Dashboard ---
  const activeLoan = userData?.creditRequests.find(c => c.status === 'approved' || c.status === 'in_review')
  const rejectedLoans = userData?.creditRequests.filter(c => c.status === 'rejected') || []

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors group" title="Volver al inicio">
               <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hola, {userData?.name} 👋</h1>
              <p className="text-sm text-gray-500">Bienvenido a tu panel financiero</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setIsLoggedIn(false)}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {loading && !userData ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            {/* Estado del Crédito Actual */}
            {!activeLoan ? (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tienes créditos activos</h3>
                <p className="text-gray-500 mt-2 mb-6">¿Necesitas dinero extra hoy mismo?</p>
                <Button onClick={() => window.location.href = '/solicitar'}>Solicitar Nuevo Crédito</Button>
                
                {rejectedLoans.length > 0 && (
                   <div className="mt-8 pt-6 border-t">
                      <p className="text-sm text-red-500 flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Tienes {rejectedLoans.length} solicitudes rechazadas recientemente.
                      </p>
                   </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Principal */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white text-card">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Crédito Activo</p>
                        <h2 className="text-3xl font-bold mt-1">${activeLoan.amount.toLocaleString()}</h2>
                      </div>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm uppercase">
                        {activeLoan.status === 'in_review' ? 'En Revisión' : 'Al día'}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-blue-100">Interés Mensual</span>
                        <span className="font-semibold">{activeLoan.interestRate}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-blue-100">Plazo Restante</span>
                        <span className="font-semibold">{
                          activeLoan.paymentInstallments.filter(i => i.status !== 'paid').length
                        } / {activeLoan.termMonths} Meses</span>
                      </div>
                    </div>
                  </div>
                  
                  {activeLoan.status === 'in_review' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-yellow-800">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">Tu crédito está en revisión. Te notificaremos cuando puedas empezar a usar el dinero.</p>
                    </div>
                  )}
                </div>

                {/* Tabla de Pagos */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      Plan de Pagos
                    </h3>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => fetchUserData(userData!.email)} 
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeLoan.paymentInstallments.length === 0 ? (
                           <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                              No hay cuotas generadas aún.
                            </td>
                           </tr>
                        ) : (
                          activeLoan.paymentInstallments.map((inst) => (
                            <tr key={inst.id} className={inst.status === 'paid' ? 'bg-gray-50/50' : ''}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {inst.installmentNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(inst.dueDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${inst.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {inst.status === 'paid' ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Pagado
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Pendiente
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {inst.status !== 'paid' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => handlePay(inst.id)}
                                    disabled={loading || payingId === inst.id || activeLoan.status === 'in_review'}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    {payingId === inst.id ? 'Pagando...' : 'Pagar'}
                                  </Button>
                                )}
                                {inst.status === 'paid' && (
                                  <span className="text-green-600 flex items-center justify-end gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Listo
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
