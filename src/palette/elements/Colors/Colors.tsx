import React from "react"
import styled from "styled-components"
import { BackgroundProps, color, ColorProps } from "styled-system"
import { themeProps } from "../../Theme"
import { Flex } from "../Flex"
import { Sans } from "../Typography"

export interface ColorBlockProps extends ColorProps, BackgroundProps {}

const ColorBlock = styled.div<ColorBlockProps>`
  width: 100%;
  height: 75px;
  padding: 10px;
  margin-bottom: 20px;
  ${color};
`

const LabeledColorBlock = ({ name }) => (
  <ColorBlock bg={name}>
    <Flex flexDirection="column">
      <Sans color={visibleColor(name)} size="3">
        {name}
      </Sans>
      <Sans color={visibleColor(name)} weight="medium" size="3">
        {themeProps.colors[name]}
      </Sans>
    </Flex>
  </ColorBlock>
)

/**
 * Artsy's color palette
 */
export const Colors = () => (
  <Flex flexWrap="wrap">
    {Object.keys(themeProps.colors).map((name, key) => (
      <LabeledColorBlock name={name} key={key} />
    ))}
  </Flex>
)

// http://24ways.org/2010/calculating-color-contrast/
const getContrast = hex => {
  const r = parseInt(hex.substr(1, 2), 16)
  const g = parseInt(hex.substr(3, 2), 16)
  const b = parseInt(hex.substr(5, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "black" : "white"
}
const visibleColor = name => getContrast(themeProps.colors[name])
