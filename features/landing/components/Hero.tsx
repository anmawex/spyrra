import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-32 space-y-24">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[80rem] rounded-full bg-gradient-to-tr from-orange-50 to-amber-50 blur-3xl opacity-50 -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-6 animate-fadeIn">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Nueva tecnología de aprobación en segundos
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 max-w-4xl mx-auto leading-tight animate-slideInLeft">
          El futuro del crédito es <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">instantáneo</span>.
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slideInRight delay-100">
          Sin filas, sin papeles y sin esperas. Spyrra utiliza inteligencia artificial para aprobar tu cupo en tiempo real. 
          El dinero en tu cuenta en menos de 5 minutos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn delay-200">
          <Link href="/solicitar">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:-translate-y-1">
              Solicitar mi Cupo Ahora <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="h-14 px-8 text-lg rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700">
              Ya tengo cuenta
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 animate-fadeIn delay-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>100% Seguro y Regulado</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Desembolso Inmediato</span>
          </div>
        </div>
      </div>
    </section>
  )
}
