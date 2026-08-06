export function MaintenancePage() {
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
          fontSize: '2.5rem',
          fontWeight: '700',
          color: 'var(--primary-color)',
          marginBottom: '0.75rem',
        }}
      >
        Sitio en mantenimiento
      </h1>
      <p
        style={{
          maxWidth: '40rem',
          fontSize: '1.125rem',
          color: 'var(--gray-600)',
          marginBottom: '0.5rem',
        }}
      >
        Estamos realizando mejoras para brindarte una mejor experiencia.
      </p>
      <p
        style={{
          maxWidth: '40rem',
          fontSize: '1rem',
          color: 'var(--gray-600)',
        }}
      >
        Por favor, vuelve a intentarlo en unos minutos.
      </p>
    </main>
  )
}