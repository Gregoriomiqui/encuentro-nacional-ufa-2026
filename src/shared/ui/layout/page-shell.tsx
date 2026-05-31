import type { PropsWithChildren } from 'react'

type PageShellProps = PropsWithChildren<{
  title: string
  subtitle?: string
}>

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <main style={{ margin: '0 auto', maxWidth: 920, padding: '3rem 1.5rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {subtitle ? <p style={{ color: '#4b5563' }}>{subtitle}</p> : null}
      </header>
      {children}
    </main>
  )
}
