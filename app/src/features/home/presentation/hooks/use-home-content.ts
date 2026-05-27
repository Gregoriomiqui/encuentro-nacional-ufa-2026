import { useEffect, useState } from 'react'

import type { HomeContent } from '@features/home/domain/entities/home-content'
import { GetHomeContentUseCase } from '@features/home/application/use-cases/get-home-content.use-case'
import { StaticHomeContentRepository } from '@features/home/infrastructure/repositories/static-home-content.repository'
import { AppError } from '@shared/lib/errors/app-error'

type UseHomeContentResult = {
  data: HomeContent | null
  error: string | null
}

export function useHomeContent(): UseHomeContentResult {
  const [data, setData] = useState<HomeContent | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const useCase = new GetHomeContentUseCase(new StaticHomeContentRepository())

    useCase
      .execute()
      .then((content) => setData(content))
      .catch(() => {
        const appError = new AppError('No se pudo cargar el contenido inicial')
        setError(appError.message)
      })
  }, [])

  return { data, error }
}
