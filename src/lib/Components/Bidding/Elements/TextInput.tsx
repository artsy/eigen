import { TextInputProps as RNTextInputProps } from "react-native"
import styled from "styled-components/native"
import { borderColor, borders, color, flex, fontSize, height, space, width } from "styled-system"
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

export interface TextInputProps
  extends BorderColorProps,
    BorderProps,
    ColorProps,
    FlexboxProps,
    FontSizeProps,
    HeightProps,
    SpaceProps,
    WidthProps,
    RNTextInputProps {}

export const TextInput = styled.TextInput.attrs<TextInputProps>({})`
  height: 40px;

  ${borders};
  ${borderColor};
  ${color};
  ${flex};
  ${fontSize};
  ${height};
  ${space};
  ${width};
`
