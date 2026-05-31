import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'var(--gray-50)',
        color: 'var(--gray-800)',
      }}
    >
      <h1
        style={{
          fontSize: '6rem',
          fontWeight: '700',
          color: 'var(--primary-color)',
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}
      >
        404
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--gray-600)' }}>
        La página que buscas no existe.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          backgroundColor: 'var(--primary-color)',
          color: 'var(--white)',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '600',
        }}
      >
        Volver al inicio
      </Link>
    </main>
  )
}
