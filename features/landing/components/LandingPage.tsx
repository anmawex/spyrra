import { Hero } from './Hero'
import { Features } from './Features'
import { Roadmap } from './Roadmap'
import { Footer } from './Footer'

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <Roadmap />
      <Footer />
    </div>
  )
}
