import React from "react"
import styled from "styled-components/native"
import { height, position, space, textAlign, width } from "styled-system"
import { HeightProps, SpaceProps, TextAlignProps, WidthProps } from "./types"

interface IconProps extends SpaceProps, WidthProps, HeightProps, SpaceProps, TextAlignProps {}

const StyledImage = styled.Image.attrs<IconProps>({})`
  ${height};
  ${position};
  ${space};
  ${textAlign};
  ${width};
`

export const Image = props => <StyledImage {...props} />
