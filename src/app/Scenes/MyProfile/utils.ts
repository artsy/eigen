/**
 *
 * @param {string} bio
 * @returns {string} A properly formatted bio for the collector profile
 * @example
 * normalizeMyProfileBio(
 * `Sentence 1\nSentence 2\rSentence 3`) = "Sentence 1. Sentence 2. Sentence 3"
 */
export const normalizeMyProfileBio = (bio: string) =>
  bio
    .replace(/(\r\n|\n|\r)/gm, ". ") // Replace line breaks with ". "
    .replace("..", ".") // Avoid double dots between sentences after replacing line breaks with ". "
