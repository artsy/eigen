import { SerifSize } from "@artsy/palette-tokens/dist/themes/v2"
import { createStyledText, FullTextProps } from "./Typography-v1"

export interface SerifProps extends Partial<FullTextProps> {
  italic?: boolean

  size: SerifSize

  /**
   * Explicitly specify `null` to inherit weight from parent, otherwise default
   * to `regular`.
   */
  weight?: null | "regular" | "semibold"
}

/**
 * The Serif typeface is used as the primary Artsy voice, guiding users through
 * flows, instruction, and communications.
 *
 * @example
 * <Serif color="black10" size="3t" weight="semibold">Hi</Serif>
 */
export const Serif = createStyledText<SerifProps>("serif")

Serif.displayName = "Serif"
