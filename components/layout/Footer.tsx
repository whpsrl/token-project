'use client'

import { FaTwitter, FaTelegram, FaGithub } from 'react-icons/fa'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              FREEPPLE
            </h3>
            <p className="text-gray-400 text-sm">
              La crypto con un motore reale.
              <br />
              Free the People. Free the Future.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigazione</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/presale" className="text-gray-400 hover:text-white transition-colors">Presale</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Info</h4>
            <ul className="space-y-2">
              <li><Link href="#tokenomics" className="text-gray-400 hover:text-white transition-colors">Tokenomics</Link></li>
              <li><Link href="#roadmap" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
              <li><Link href="/whitepaper" className="text-gray-400 hover:text-white transition-colors">Whitepaper</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Social</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/FreeppleToken"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <FaTelegram className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© 2025 Freepple. All rights reserved.</p>
          <p className="mt-2">Non investire più di quanto puoi permetterti di perdere. DYOR.</p>
        </div>
      </div>
    </footer>
  )
}


