import { Brain, SearchCheck, Zap, ShieldCheck } from 'lucide-react'

export function Features() {
  const steps = [
    {
      title: 'Análisis de Riesgo en Tiempo Real',
      description: 'Nuestro motor de decisiones evalúa tu perfil financiero instantáneamente para calcular tu capacidad de pago sin esperas.',
      icon: Brain,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Verificación de Identidad Digital',
      description: 'Proceso 100% online. Validamos tus datos personales y documentos de forma segura sin que tengas que ir a una oficina.',
      icon: SearchCheck,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Simulación de Desembolso',
      description: 'Experimenta la rapidez de una fintech moderna. Una vez aprobado, el sistema simula la transferencia de fondos al instante.',
      icon: Zap,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'Seguridad de Datos',
      description: 'Tu información está protegida. Implementamos estándares de validación y manejo seguro de datos personales.',
      icon: ShieldCheck,
      color: 'bg-cyan-100 text-cyan-600',
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Tecnología al servicio de tus finanzas
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Hemos rediseñado el proceso de crédito desde cero para eliminar fricciones y costos ocultos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${step.color}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
