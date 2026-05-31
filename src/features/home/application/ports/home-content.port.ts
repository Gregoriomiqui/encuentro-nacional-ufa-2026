import type { HomeContent } from '@features/home/domain/entities/home-content'

export interface HomeContentPort {
  getContent(): Promise<HomeContent>
}
