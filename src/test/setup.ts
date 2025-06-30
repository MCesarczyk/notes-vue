import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: () => 'test-id-123'
}))

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockReturnValue(null)
})