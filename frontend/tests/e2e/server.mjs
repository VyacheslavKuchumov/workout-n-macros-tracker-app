globalThis.localStorage = {
  getItem() {
    return null
  },
  setItem() {},
  removeItem() {},
  clear() {},
  key() {
    return null
  },
  get length() {
    return 0
  }
}

await import('../../.output/server/index.mjs')
