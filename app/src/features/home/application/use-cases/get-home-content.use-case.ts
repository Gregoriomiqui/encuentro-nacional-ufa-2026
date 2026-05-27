import type { HomeContent } from '@features/home/domain/entities/home-content'
import type { HomeContentPort } from '@features/home/application/ports/home-content.port'

export class GetHomeContentUseCase {
  private readonly homeContentPort: HomeContentPort

  constructor(homeContentPort: HomeContentPort) {
    this.homeContentPort = homeContentPort
  }

  execute(): Promise<HomeContent> {
    return this.homeContentPort.getContent()
  }
}
