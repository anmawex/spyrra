export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between lg:flex-row gap-8">
        
        {/* Logo y Copyright */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
            Spyrra
          </h2>
          <p className="mt-2 text-sm">
            © {currentYear} Spyrra Financial Inc.
          </p>
          <p className="text-sm mt-1">Todos los derechos reservados.</p>
        </div>

        {/* Legal Links */}
        <div className="flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Soporte</a>
        </div>

      </div>
    </footer>
  )
}
