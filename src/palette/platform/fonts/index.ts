export { fontFamily } from "./fontFamily"

/**
 * Type definition for font objects
 */
export interface FontDefinition {
  fontFamily: string
  fontWeight?: string | number
  fontStyle?: string
}

/**
 * Type definition for font value properties which can either
 * be an object for complex definitions or a string for single entries.
 */
export type FontValue = string | FontDefinition

/**
 * Defines the shape of the font family
 */
export interface FontFamily {
  sans: {
    regular: FontValue
    italic: FontValue
    medium: FontValue
    mediumItalic: FontValue
  }
  serif: {
    regular: FontValue
    italic: FontValue
    semibold: FontValue
  }
  display: {
    regular: FontValue
  }
}
