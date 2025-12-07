import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Presale from '@/components/landing/Presale'
import Tokenomics from '@/components/landing/Tokenomics'
import Roadmap from '@/components/landing/Roadmap'
import CTA from '@/components/landing/CTA'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <Presale />
      <Tokenomics />
      <Roadmap />
      <CTA />
      <Footer />
    </main>
  )
}

