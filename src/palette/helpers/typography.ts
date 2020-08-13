import { endash } from "../elements/Typography"

/**
 * A helper func to create a range string out of two strings, by putting an endash between them.
 */
export const range = (left: string, right: string): string =>
  `${left} ${endash} ${right}`
