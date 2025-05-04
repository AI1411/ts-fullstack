// Database-related configuration and utilities
// This file can be used for any client-side data persistence needs

// Example: Local storage utilities
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting item from localStorage', error)
      return null
    }
  },

  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting item in localStorage', error)
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing item from localStorage', error)
    }
  }
}
