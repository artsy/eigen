import { normalizeText } from "./normalizeText"

export interface AutocompleteEntry<T> {
  key: T
  searchTerms: string[]
  importance: number
}

export class Autocomplete<T> {
  private cache: Record<string, Array<AutocompleteEntry<T>>> = {}
  private cacheOrder: string[] = []
  constructor(
    private entries: Array<AutocompleteEntry<T>>,
    private maxCacheItems = 100,
    stopWords = ["of", "the", "and"]
  ) {
    for (const entry of entries) {
      entry.searchTerms = entry.searchTerms.map(normalizeText)
      for (const searchTerm of entry.searchTerms.slice(0)) {
        const parts = searchTerm.split(/\s+/).filter((s) => !stopWords.includes(s))
        if (parts.length > 1) {
          entry.searchTerms.push(...parts)
        }
      }
    }
  }

  getSuggestions(searchString: string): T[] {
    searchString = normalizeText(searchString)
    if (this.cache[searchString]) {
      return this.cache[searchString].map((e) => e.key)
    }

    // refine previous results if available
    let possibleEntries: Array<AutocompleteEntry<T>> = this.entries
    for (let i = searchString.length - 2; i > 0; i--) {
      if (this.cache[searchString.slice(0, i)]) {
        possibleEntries = this.cache[searchString.slice(0, i)]
        break
      }
    }

    const results: Array<AutocompleteEntry<T>> = possibleEntries.filter((entry) => {
      for (const searchTerm of entry.searchTerms) {
        if (searchTerm.startsWith(searchString)) {
          return true
        }
      }
      return false
    })

    results.sort((a, b) => b.importance - a.importance)

    this.cache[searchString] = results
    this.cacheOrder.push(searchString)
    while (this.cacheOrder.length > this.maxCacheItems) {
      delete this.cache[this.cacheOrder.shift()!]
    }

    return results.map((e) => e.key)
  }
}
