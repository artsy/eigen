import { useMemo } from "react"
import { normalizeText } from "shared/utils"

class CharNode {
  public children: Record<string, CharNode>
  public char: string | null = null
  public isAWord: boolean = false

  constructor(char?: string) {
    if (char) {
      this.char = char
    }
    this.children = {}
  }

  insertWord = (word: string) => {
    word = normalizeText(word, false)
    if (!word.length) {
      return
    }
    const firstChar = word[0]
    let child = this.children[firstChar]
    if (!child) {
      child = new CharNode(firstChar)
      this.children[firstChar] = child
    }

    if (word.length > 1) {
      child.insertWord(word.substring(1))
    } else {
      child.isAWord = true
    }
  }
}

type AutoSuggestData = string[]

function initializeRoot(data: AutoSuggestData) {
  const root = new CharNode()
  for (const word of data) {
    if (word) {
      root.insertWord(word)
    }
  }
  return root
}

/**
 * AutoSuggest is similar to the AutoComplete in pallette but this is best suitable for Input suggestions/completion
 * as it can return the next best string for input completion
 * AutoSuggest is implemented with Trie
 * @param data
 * @returns AutoSuggestHookReturnType
 */
export class AutoSuggest {
  private root: CharNode
  constructor(data: AutoSuggestData) {
    this.root = initializeRoot(data)
  }

  normalizeWord = (word: string) => {
    return normalizeText(word, false)
  }

  /**
   * A little helper to help check if a word can be suggested
   * When matchExact is true, it returns true if word being checked is in the data. Eg
   * when matchExact is true and word "myword" is in the data, "mywor" will return false and
   * "myword" will return true. Else if matchExact is false "mywor" as well as "myword" will
   * return true.
   * @param word
   * @param matchExact
   * @returns boolean
   */
  isSuggestible = (word: string, matchExact: boolean = false): boolean => {
    word = this.normalizeWord(word)
    let lastCharNode = this.root
    for (const char of word) {
      lastCharNode = lastCharNode.children[char]
      if (!lastCharNode) {
        return false
      }
    }
    return !matchExact || lastCharNode.isAWord
  }

  _buildSuggestions = (node: CharNode, suggestedWords: string[], currWord: string) => {
    if (node.isAWord) {
      suggestedWords.push(currWord)
    }
    const keys = Object.keys(node.children)
    if (!keys.length) {
      return suggestedWords
    }

    for (const key of keys) {
      const child = node.children[key]
      if (child) {
        this._buildSuggestions(child, suggestedWords, currWord + child.char)
      }
    }
    return suggestedWords
  }

  getSuggestionsForWord = (word: string) => {
    word = this.normalizeWord(word)
    let suggestedWords: string[] = []
    let lastCharNode = this.root
    let currentWord = ""

    for (const char of word) {
      lastCharNode = lastCharNode.children[char]
      if (!lastCharNode) {
        return suggestedWords
      }
      currentWord = currentWord + lastCharNode.char
    }
    suggestedWords = this._buildSuggestions(lastCharNode, suggestedWords, currentWord)
    return suggestedWords
  }

  getNextSuggestionForWord = (word: string) => {
    word = this.normalizeWord(word)
    const suggestions = this.getSuggestionsForWord(word)
    console.log("Sugg", suggestions)
    let nextSuggestion: string | null = null
    let i = 0
    while (i < suggestions.length && !nextSuggestion) {
      if (word !== suggestions[i]) {
        nextSuggestion = suggestions[i]
      }
      i++
    }
    return nextSuggestion
  }
}

interface AutoSuggestHookReturnType {
  isSuggestible: (word: string, matchExact?: boolean) => boolean
  getNextSuggestionForWord: (word: string) => string | null
  getSuggestionsForWord: (word: string) => string[]
}

/**
 * AutoSuggest is similar to the AutoComplete in palette but this is suitable for Input
 * suggestions/completion or when you are dealing with only strings
 * and for when you want to rank suggestions based on closest to a real word
 * rather than by predetermined importance.
 *
 * AutoSuggest is implemented with Trie.
 * Insertion and get
 *
 * @param data
 * @returns AutoSuggestHookReturnType
 */
export const useAutoSuggest = (data: AutoSuggestData): AutoSuggestHookReturnType => {
  const autoSuggest = useMemo(() => new AutoSuggest(data), [data])
  return {
    isSuggestible: autoSuggest.isSuggestible,
    getNextSuggestionForWord: autoSuggest.getNextSuggestionForWord,
    getSuggestionsForWord: autoSuggest.getSuggestionsForWord,
  }
}
