import { useEffect, type PropsWithChildren } from 'react'

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')

    links.forEach((link) => {
      if (!link.href.includes(window.location.hostname)) {
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
      }
    })
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.card, .legal-section, .hero-content, .inscription-content, .contact-info',
    )

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
      })
      return
    }

    elements.forEach((element) => {
      element.style.opacity = '0'
      element.style.transform = 'translateY(20px)'
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.style.opacity = '1'
            target.style.transform = 'translateY(0)'
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  return children
}
