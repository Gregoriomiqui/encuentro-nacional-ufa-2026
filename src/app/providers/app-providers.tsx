import { useEffect, type PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import { useInRouterContext, useLocation } from 'react-router-dom'

function RouterLocationEffects() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      return
    }

    globalThis.window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!location.hash) {
      return
    }

    const elementId = decodeURIComponent(location.hash.slice(1))

    const scrollToHashTarget = () => {
      const target = document.getElementById(elementId)

      if (!target) {
        return false
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return true
    }

    if (scrollToHashTarget()) {
      return
    }

    const timer = globalThis.window.setTimeout(() => {
      scrollToHashTarget()
    }, 120)

    return () => {
      globalThis.window.clearTimeout(timer)
    }
  }, [location.hash, location.pathname])

  return null
}

export function AppProviders({ children }: Readonly<PropsWithChildren>) {
  const hasRouterContext = useInRouterContext()

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')

    links.forEach((link) => {
      if (!link.href.includes(globalThis.window.location.hostname)) {
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
      }
    })
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.card, .legal-section, .hero-content, .inscription-content, .contact-info',
    )

    if (!('IntersectionObserver' in globalThis.window)) {
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

  return (
    <>
      {hasRouterContext ? <RouterLocationEffects /> : null}
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            color: '#1f2937',
          },
          success: {
            iconTheme: {
              primary: '#027a48',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#b42318',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  )
}
