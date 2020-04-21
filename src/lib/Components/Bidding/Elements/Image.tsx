import React from "react"
// @ts-ignore STRICTNESS_MIGRATION
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

export const Image = (props: any /* STRICTNESS_MIGRATION */) => <StyledImage {...props} />
