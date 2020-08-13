import { css } from "styled-components"
import { breakpoints } from "../Theme"

type Media = { [S in keyof typeof breakpoints]: typeof css }

/**
 * A helper to construct media query strings for responsive style targeting.
 *
 * @example
 *
 * const Panel = styled.div`
 *   ${media.sm`
 *     width: 50%;
 *   `}
 *   ${media.lg`
 *     width: 100%;
 *   `}
 * `
 */
export const media: Media = Object.entries(breakpoints).reduce(
  (accumulator, [label, value]) => {
    return {
      ...accumulator,
      [label]: (strings, ...args) => css`
        @media (max-width: ${value}) {
          ${css(strings, ...args)};
        }
      `,
    }
  },
  {}
) as Media
