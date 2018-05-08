import React from "react"
import styled from "styled-components/native"
import { color, fontSize, lineHeight, maxWidth, space, textAlign } from "styled-system"

import { Fonts } from "../../../data/fonts"

const Sans = styled.Text`
  font-family: "${Fonts.Unica77LLMedium}";
  ${color}
  ${fontSize}
  ${lineHeight}
  ${space}
  ${textAlign}
  ${maxWidth}
`

const Serif = styled.Text`
  font-family: "${Fonts.GaramondRegular}";
  ${color}
  ${fontSize}
  ${lineHeight}
  ${space}
  ${textAlign}
  ${maxWidth}
`

const SerifSemibold = styled.Text`
  font-family: "${Fonts.GaramondSemibold}";
  ${color}
  ${fontSize}
  ${lineHeight}
  ${space}
  ${textAlign}
  ${maxWidth}
`

const SerifItalic = styled.Text`
  font-family: "${Fonts.GaramondItalic}";
  ${color}
  ${fontSize}
  ${lineHeight}
  ${space}
  ${textAlign}
  ${maxWidth}
`

export const Sans12 = props => <Sans fontSize={1} {...props} />
export const Sans14 = props => <Sans fontSize={2} {...props} />
export const Sans16 = props => <Sans fontSize={3} {...props} />
export const Sans18 = props => <Sans fontSize={4} {...props} />

export const Serif12 = props => <Serif fontSize={1} {...props} />
export const Serif14 = props => <Serif fontSize={2} {...props} />
export const Serif16 = props => <Serif fontSize={3} {...props} />
export const Serif18 = props => <Serif fontSize={4} {...props} />

export const SerifSemibold12 = props => <SerifSemibold fontSize={1} {...props} />
export const SerifSemibold14 = props => <SerifSemibold fontSize={2} {...props} />
export const SerifSemibold16 = props => <SerifSemibold fontSize={3} {...props} />
export const SerifSemibold18 = props => <SerifSemibold fontSize={4} {...props} />
export const SerifSemibold22 = props => <SerifSemibold fontSize={5} {...props} />

export const SerifItalic12 = props => <SerifItalic fontSize={1} {...props} />
export const SerifItalic14 = props => <SerifItalic fontSize={2} {...props} />
export const SerifItalic16 = props => <SerifItalic fontSize={3} {...props} />
export const SerifItalic18 = props => <SerifItalic fontSize={4} {...props} />
