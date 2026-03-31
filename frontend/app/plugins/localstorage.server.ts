export default defineNuxtPlugin(() => {
  const existingStorage = (globalThis as { localStorage?: Storage }).localStorage

  if (existingStorage && typeof existingStorage.getItem === 'function') {
    return
  }

  const memory = new Map<string, string>()

  const storageShim: Storage = {
    get length() {
      return memory.size
    },
    clear() {
      memory.clear()
    },
    getItem(key: string) {
      return memory.has(key) ? memory.get(key)! : null
    },
    key(index: number) {
      return Array.from(memory.keys())[index] ?? null
    },
    removeItem(key: string) {
      memory.delete(key)
    },
    setItem(key: string, value: string) {
      memory.set(key, String(value))
    }
  }

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storageShim
  })
})
