export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #1a1a1a, #4c1d95, #1a1a1a)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>404</h1>
      <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Pagina Non Trovata</h2>
      <p style={{ fontSize: '18px', marginBottom: '40px', color: '#a855f7' }}>
        La pagina che stai cercando non esiste.
      </p>
      <a
        href="/"
        style={{
          color: 'white',
          background: '#9333ea',
          padding: '15px 30px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
      >
        Torna alla Home
      </a>
    </div>
  )
}


