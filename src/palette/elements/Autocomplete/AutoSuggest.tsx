import { useMemo } from "react"
import { normalizeText } from "shared/utils"

class CharNode {
  public children: Record<string, CharNode>
  public char: string | null = null
  public originalChar: string | null = null
  public isAWord: boolean = false

  constructor(char?: string, originalChar?: string) {
    if (char) {
      this.char = char
    }
    if (originalChar) {
      this.originalChar = originalChar
    }
    this.children = {}
  }

  insertWord = (word: string) => {
    const normalizedWord = normalizeText(word, false)
    if (!normalizedWord.length) {
      return
    }
    const firstChar = normalizedWord[0]
    const firstOriginalChar = word[0]
    let child = this.children[firstChar]
    if (!child) {
      child = new CharNode(firstChar, firstOriginalChar)
      this.children[firstChar] = child
    }

    if (normalizedWord.length > 1) {
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
    root.insertWord(word)
  }
  return root
}

/**
 * AutoSuggest is similar to the AutoComplete in palette but this is suitable for Input
 * suggestions/completion or when you are dealing with only strings
 * and for when you want to rank suggestions based on closest to a real word
 * rather than by predetermined importance.
 *
 * AutoSuggest is implemented with Trie.
 *
 *  While initialization, insertion and getting suggestions are significantly faster than
 * uncached Autocomplete, AutoSuggest will use more memory to hold the suggestion data because
 *  each node can point to many nodes.
 *
 * @constructor data
 *
 * @example <caption>Usage of AutoSuggest</caption>
 * const autoSuggest = new AutoSuggest(["Banksy", "Bankzy N", "Andy Warhol"])
 * autoSuggest.isSuggestible("bank", false) // returns true
 * autoSuggest.isSuggestible("bank", true) // returns false
 * autoSuggest.isSuggestible("Banksy", true) // returns true
 * autoSuggest.isSuggestible("Banksyyyy", false) // returns false
 *
 * autoSuggest.getNextSuggestion("bank") // returns "Banksy"
 * autoSuggest.getNextSuggestion("banksy") // returns null
 *
 * autoSuggest.getSuggestions("bank") // returns ["Banksy", "Bankzy N"]
 * autoSuggest.getSuggestions("banksy") // returns ["Banksy"]
 *
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
   * A little helper method to help check if a word can possibly be suggested.
   * When matchExact is true, it returns true if word that is being checked is in the data. Eg
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
        this._buildSuggestions(child, suggestedWords, currWord + child.originalChar ?? child.char)
      }
    }
    return suggestedWords
  }

  /** For a given string, returns a list of the next best suggestions based on data initialised with */
  getSuggestions = (word: string) => {
    word = this.normalizeWord(word)
    let suggestedWords: string[] = []
    let lastCharNode = this.root
    let currentWord = ""

    for (const char of word) {
      lastCharNode = lastCharNode.children[char]
      if (!lastCharNode) {
        return suggestedWords
      }
      currentWord = currentWord + lastCharNode.originalChar ?? lastCharNode.char
    }
    suggestedWords = this._buildSuggestions(lastCharNode, suggestedWords, currentWord)
    return suggestedWords
  }

  /** For a given string, returns the next best suggestion or null if there is no next best suggestion to return */
  getNextSuggestion = (word: string) => {
    const suggestions = this.getSuggestions(word)
    let nextSuggestion: string | null = null
    let i = 0
    while (i < suggestions.length && !nextSuggestion) {
      if (this.normalizeWord(word) !== this.normalizeWord(suggestions[i])) {
        nextSuggestion = suggestions[i]
      }
      i++
    }
    return nextSuggestion
  }
}

interface AutoSuggestHookReturnType {
  /**
   * A little helper method to help check if a word can possibly be suggested.
   * When matchExact is true, it returns true if word that is being checked is in the data. Eg
   * when matchExact is true and word "myword" is in the data, "mywor" will return false and
   * "myword" will return true. Else if matchExact is false "mywor" as well as "myword" will
   * return true.
   * @param word
   * @param matchExact
   * @returns boolean
   */
  isSuggestible: (word: string, matchExact?: boolean) => boolean
  /** For a given string, returns the next best suggestion or null if there is no next best suggestion to return */
  getNextSuggestion: (word: string) => string | null
  /** For a given string, returns a list of the next best suggestions based on data initialised with */
  getSuggestions: (word: string) => string[]
}

/**
 * AutoSuggest is similar to the AutoComplete in palette but this is suitable for Input
 * suggestions/completion or when you are dealing with only strings
 * and for when you want to rank suggestions based on closest to a real word
 * rather than by predetermined importance.
 *
 * AutoSuggest is implemented with Trie.
 *  While initialization, insertion and getting suggestions are significantly faster than
 * uncached Autocomplete, AutoSuggest will use more memory to hold the suggestion data because
 *  each node can point to many nodes.
 *
 * @param data
 * @returns AutoSuggestHookReturnType
 *
 * @example <caption>Usage of useAutoSuggest</caption>
 * const { isSuggestible, getNextSuggestion, getSuggestions} = useAutoSuggest(["Banksy", "Bankzy N", "Andy Warhol"])
 * isSuggestible("bank", false) // returns true
 * isSuggestible("bank", true) // returns false
 * isSuggestible("Banksy", true) // returns true
 * isSuggestible("Banksyyyy", false) // returns false
 *
 * getNextSuggestion("bank") // returns "Banksy"
 * getNextSuggestion("banksy") // returns null
 *
 * getSuggestions("bank") // returns ["Banksy", "Bankzy N"]
 * getSuggestions("banksy") // returns ["Banksy"]
 */
export const useAutoSuggest = (data: AutoSuggestData): AutoSuggestHookReturnType => {
  const autoSuggest = useMemo(() => new AutoSuggest(data), [data])
  return {
    isSuggestible: autoSuggest.isSuggestible,
    getNextSuggestion: autoSuggest.getNextSuggestion,
    getSuggestions: autoSuggest.getSuggestions,
  }
}
