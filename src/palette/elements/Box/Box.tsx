import { View, ViewProps } from "react-native"
import styled from "styled-components/native"
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

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    Omit<ColorProps, "color">,
    FlexboxProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    TextAlignProps,
    ViewProps {}

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
 * Box is just a `View` with common styled-system props.
 */
export const Box = styled(View)<BoxProps>`
  ${boxMixin}
`

Box.displayName = "Box"
