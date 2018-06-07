import { TextInputProperties } from "react-native"
import styled from "styled-components/native"
import { borderColor, borders, color, flex, fontSize, height, space, width } from "styled-system"
import { Fonts } from "../../../data/fonts"
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
    TextInputProperties {}

export const TextInput = styled.TextInput.attrs<TextInputProps>({})`
  font-family: "${Fonts.GaramondRegular}";
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
