import styled from "styled-components/native"
import { borders, color, flex, fontSize, space, width } from "styled-system"
import { BorderWidthProps, ColorProps, FlexboxProps, FontSizeProps, SpaceProps, WidthProps } from "./types"

interface FlexProps extends BorderWidthProps, SpaceProps, WidthProps, FontSizeProps, ColorProps, FlexboxProps {}

export const Flex = styled.View.attrs<FlexProps>({})`
  ${borders};
  ${space};
  ${width};
  ${fontSize};
  ${color};
  ${flex};
`
