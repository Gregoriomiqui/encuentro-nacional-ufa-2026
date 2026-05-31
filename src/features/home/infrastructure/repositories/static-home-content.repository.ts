import type { HomeContentPort } from '@features/home/application/ports/home-content.port'
import type { HomeContent } from '@features/home/domain/entities/home-content'

const staticHomeContent: HomeContent = {
  title: 'Scaffolding profesional listo',
  subtitle: 'Feature-First + Clean Architecture sobre React 19 y Vite.',
  cta: 'Continuar con Dia 3 (TDD)',
}

export class StaticHomeContentRepository implements HomeContentPort {
  getContent(): Promise<HomeContent> {
    return Promise.resolve(staticHomeContent)
  }
}
