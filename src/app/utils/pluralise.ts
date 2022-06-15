/**
 * Pluralise words
 * @param word The word to pluralise
 * @param occcurances The number of occcurances
 * @param wordInPlural word in plural form
 * @returns The pluralised word
 */
export const pluralise = (word: string, occurances: number, wordInPlural?: string) => {
  if (occurances > 1) {
    if (wordInPlural) {
      return wordInPlural
    }
    return `${word}s`
  }
  return word
}
