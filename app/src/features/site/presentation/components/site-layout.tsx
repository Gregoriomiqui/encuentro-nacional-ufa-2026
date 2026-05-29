import type { PropsWithChildren } from 'react'

import { BackToTopButton } from '@features/site/presentation/components/back-to-top-button'
import { SiteFooter } from '@features/site/presentation/components/site-footer'
import { SiteHeader } from '@features/site/presentation/components/site-header'

type SiteLayoutProps = PropsWithChildren<{
  title: string
}>

export function SiteLayout({ title, children }: SiteLayoutProps) {
  return (
    <>
      <SiteHeader title={title} />
      {children}
      <SiteFooter />
      <BackToTopButton />
    </>
  )
}
