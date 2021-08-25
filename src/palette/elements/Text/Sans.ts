import { SansSize } from "@artsy/palette-tokens/dist/themes/v2"
import { createStyledText, FullTextProps } from "./Typography-v1"

export interface SansProps extends Partial<FullTextProps> {
  italic?: boolean

  role?: string

  size: SansSize

  /**
   * Explicitly specify `null` to inherit weight from parent, otherwise default
   * to `regular`.
   */
  weight?: null | "regular" | "medium"
}

/**
 * The Sans typeface is used for presenting objective dense information
 * (such as tables) and intervening communications (such as error feedback).
 *
 * @example
 * <Sans color="black10" size="3t" weight="medium" italic>Hi</Sans>
 */
export const Sans = createStyledText<SansProps>("sans")

Sans.displayName = "Sans"
