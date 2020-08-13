import { styled as primitives } from "../../platform/primitives"

import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from "styled-system"
import { splitProps } from "../../utils/splitProps"

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    Omit<ColorProps, "color">,
    FlexboxProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    TextAlignProps {}

/**
 * All the system functions for Box
 */
export const boxMixin = compose(
  background,
  border,
  color,
  flexbox,
  layout,
  position,
  space,
  textAlign
)

/**
 * Box is just a `View` or `div` (depending on the platform) with common styled-systems
 * hooks.
 */
export const Box = primitives.View<BoxProps>`
  ${boxMixin}
`

Box.displayName = "Box"

/** Splits out props into valid and invalid BoxProps */
export const splitBoxProps = splitProps<BoxProps>(boxMixin)
