import React from "react"
import styled from "styled-components/native"
import { height, space, textAlign, width } from "styled-system"
import { HeightProps, SpaceProps, TextAlignProps, WidthProps } from "./types"

interface IconProps extends SpaceProps, WidthProps, HeightProps, SpaceProps, TextAlignProps {}

const Icon = styled.Image.attrs<IconProps>({})`
  ${width};
  ${height};
  ${space};
  ${textAlign};
`

export const Icon20 = props => <Icon width={20} height={20} {...props} />
