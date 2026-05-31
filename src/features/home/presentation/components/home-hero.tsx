import { startTransition, useOptimistic } from 'react'

import { featureFlags } from '@shared/config/feature-flags'
import type { HomeContent } from '@features/home/domain/entities/home-content'

type HomeHeroProps = {
  content: HomeContent
}

export function HomeHero({ content }: HomeHeroProps) {
  const [optimisticCta, setOptimisticCta] = useOptimistic(content.cta)

  return (
    <section>
      <h2 style={{ marginBottom: '0.5rem' }}>{content.title}</h2>
      <p style={{ color: '#4b5563' }}>{content.subtitle}</p>
      <button
        type="button"
        style={{ marginTop: '1rem' }}
        onClick={() => {
          if (featureFlags.optimisticUi) {
            startTransition(() => {
              setOptimisticCta('Preparando flujo TDD...')
            })
          }
        }}
      >
        {optimisticCta}
      </button>
    </section>
  )
}
