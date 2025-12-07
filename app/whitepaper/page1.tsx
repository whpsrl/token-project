'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ReactMarkdown from 'react-markdown'
import { FaFilePdf, FaDownload } from 'react-icons/fa'

export default function WhitepaperPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/docs/WHITEPAPER.md')
      .then(res => res.text())
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading whitepaper:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Whitepaper
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Documento tecnico completo del progetto Freepple
          </p>
          <a
            href="/docs/WHITEPAPER.md"
            download
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
          >
            <FaDownload />
            Scarica PDF
          </a>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-gray-400">Caricamento whitepaper...</div>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 prose prose-invert prose-lg max-w-none">
            <style jsx global>{`
              .prose {
                color: #e5e7eb;
              }
              .prose h1 {
                color: #f3f4f6;
                font-size: 2.5em;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                border-bottom: 2px solid #7c3aed;
                padding-bottom: 0.5em;
              }
              .prose h2 {
                color: #d1d5db;
                font-size: 2em;
                margin-top: 1.5em;
                margin-bottom: 0.75em;
                border-bottom: 1px solid #6b7280;
                padding-bottom: 0.25em;
              }
              .prose h3 {
                color: #e5e7eb;
                font-size: 1.5em;
                margin-top: 1.25em;
                margin-bottom: 0.5em;
              }
              .prose p {
                margin-bottom: 1em;
                line-height: 1.75;
              }
              .prose strong {
                color: #a78bfa;
                font-weight: 600;
              }
              .prose ul, .prose ol {
                margin-bottom: 1.5em;
                padding-left: 1.5em;
              }
              .prose li {
                margin-bottom: 0.5em;
              }
              .prose table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5em 0;
              }
              .prose th {
                background-color: #4b5563;
                color: #f3f4f6;
                padding: 0.75em;
                text-align: left;
                border: 1px solid #6b7280;
              }
              .prose td {
                padding: 0.75em;
                border: 1px solid #6b7280;
              }
              .prose tr:nth-child(even) {
                background-color: #374151;
              }
              .prose code {
                background-color: #1f2937;
                color: #fbbf24;
                padding: 0.2em 0.4em;
                border-radius: 0.25em;
                font-size: 0.9em;
              }
              .prose pre {
                background-color: #1f2937;
                padding: 1em;
                border-radius: 0.5em;
                overflow-x: auto;
                margin: 1.5em 0;
              }
              .prose pre code {
                background-color: transparent;
                padding: 0;
              }
              .prose hr {
                border-color: #6b7280;
                margin: 2em 0;
              }
              .prose a {
                color: #a78bfa;
                text-decoration: underline;
              }
              .prose a:hover {
                color: #c4b5fd;
              }
            `}</style>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

