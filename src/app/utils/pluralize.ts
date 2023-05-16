/**
 * Method that returns the plural of a word
 * @param word
 * @param count
 * @param customPlural
 * @returns string
 */
export const pluralize = (word: string, count: number, customPlural?: string) => {
  if (count === 1) {
    return word
  }

  if (customPlural) {
    return customPlural
  }

  return `${word}s`
}
