/*
 ** @description Check if a string includes another string, ignoring accents and case
 ** @param {string} string1
 ** @param {string} string2
 */
export const stringIncludes = (string1: string, string2: string) => {
  const normalizedString1 = string1
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()

  const normalizedString2 = string2
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()

  return normalizedString1?.includes(normalizedString2)
}
