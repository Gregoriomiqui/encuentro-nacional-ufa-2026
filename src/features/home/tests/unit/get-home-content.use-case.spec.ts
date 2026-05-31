import { describe, expect, it } from 'vitest'

import type { HomeContentPort } from '@features/home/application/ports/home-content.port'
import { GetHomeContentUseCase } from '@features/home/application/use-cases/get-home-content.use-case'

describe('GetHomeContentUseCase', () => {
  it('retorna el contenido proporcionado por el puerto', async () => {
    const fakeRepository: HomeContentPort = {
      getContent: async () => ({
        title: 'Titulo',
        subtitle: 'Subtitulo',
        cta: 'Continuar',
      }),
    }

    const useCase = new GetHomeContentUseCase(fakeRepository)
    const result = await useCase.execute()

    expect(result).toEqual({
      title: 'Titulo',
      subtitle: 'Subtitulo',
      cta: 'Continuar',
    })
  })
})
