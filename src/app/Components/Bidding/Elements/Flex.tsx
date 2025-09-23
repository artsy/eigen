import styled from "styled-components/native"
import {
  borderColor,
  borders,
  BorderWidthProps,
  color,
  flex,
  fontSize,
  height,
  space,
  width,
} from "styled-system"
import {
  BorderColorProps,
  BorderProps,
  ColorProps,
  FlexboxProps,
  FontSizeProps,
  HeightProps,
  SpaceProps,
  WidthProps,
} from "./types"

export interface FlexProps
  extends BorderColorProps,
    BorderProps,
    BorderWidthProps,
    ColorProps,
    FlexboxProps,
    FontSizeProps,
    HeightProps,
    SpaceProps,
    WidthProps {}

export const Flex = styled.View.attrs({})`
  ${borders};
  ${borderColor};
  ${color};
  ${flex};
  ${fontSize};
  ${height};
  ${space};
  ${width};
`
