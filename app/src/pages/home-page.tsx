import { HomeHero } from '@features/home/presentation/components/home-hero'
import { useHomeContent } from '@features/home/presentation/hooks/use-home-content'
import { PageShell } from '@shared/ui/layout/page-shell'
import { env } from '@shared/config/env'

export function HomePage() {
  const { data, error } = useHomeContent()

  return (
    <PageShell
      title="Dia 2: Scaffolding modular aplicado"
      subtitle={`API base configurada: ${env.apiBaseUrl || 'sin definir'}`}
    >
      {error ? <p>{error}</p> : null}
      {data ? <HomeHero content={data} /> : <p>Cargando contenido...</p>}
    </PageShell>
  )
}
