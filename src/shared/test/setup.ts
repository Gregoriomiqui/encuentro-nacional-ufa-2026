import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom does not implement scrollTo; mock it to avoid noisy stderr in CI.
Object.defineProperty(globalThis.window, 'scrollTo', {
	value: vi.fn(),
	writable: true,
})
