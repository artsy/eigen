import { themeGet } from "@styled-system/theme-get"
import styled, { css } from "styled-components"
import { variant } from "styled-system"
import { Box, BoxProps } from "../Box"
import { BaseTextProps, textMixin } from "./Text.shared"
import { TEXT_VARIANTS } from "./tokens"

/** Adds ellipsis to overflowing text */
export const overflowEllipsisMixin = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

/** TextProps */
export type TextProps = BaseTextProps &
  BoxProps & { overflowEllipsis?: boolean }

/** Text */
export const Text = styled(Box)<TextProps>`
  ${variant({ variants: TEXT_VARIANTS.small })}
  ${textMixin}

  @media (min-width: ${themeGet("breakpoints.0")}) {
    ${variant({ variants: TEXT_VARIANTS.large })}
    ${textMixin}
  }

  ${({ overflowEllipsis }) => overflowEllipsis && overflowEllipsisMixin}
`

Text.displayName = "Text"

Text.defaultProps = {
  fontFamily: "sans",
}
