export function Roadmap() {
  const roadmap = [
    { period: 'Hoy', feature: 'Crédito Instantáneo', completed: true },
    { period: 'Q3 2026', feature: 'Tarjeta Débito Física', completed: false },
    { period: 'Q4 2026', feature: 'Billetera de Inversiones', completed: false },
    { period: '2027', feature: 'CriptoExchange', completed: false },
  ]

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 sm:text-4xl mb-6">
              Más que un préstamo.<br />
              Un ecosistema financiero.
            </h2>
            <p className="text-xl text-gray-500 mb-8 max-w-lg">
              Esto es solo el comienzo. Estamos construyendo el banco del futuro, donde tú tienes el control total de tu dinero.
            </p>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative border-l-2 border-gray-100 pl-8 space-y-10">
              {roadmap.map((item, idx) => (
                <div key={item.period} className="relative group">
                  <div className={`absolute -left-[39px] flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white transition-all duration-300 z-10 ${item.completed ? 'border-blue-600 scale-110' : 'border-gray-200 group-hover:border-blue-300'}`}>
                    {item.completed && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${item.completed ? 'text-blue-600' : 'text-gray-400'}`}>
                      {item.period}
                    </span>
                    <h3 className={`text-xl font-bold ${item.completed ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600 transition-colors'}`}>
                      {item.feature}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
