import { themeGet } from "@styled-system/theme-get"
import React from "react"
import styled, { css } from "styled-components/native"
import { Box } from "../Box"

const RADIO_DOT_MODES = {
  default: {
    resting: css`
      border: 2px solid;
      color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.black10")};
    `,
    selected: css`
      border: 2px solid;
      color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.black100")};
      background-color: ${themeGet("colors.black100")};
    `,
  },
  disabled: {
    resting: css`
      border: 2px solid;
      color: transparent;
      border-color: ${themeGet("colors.black10")};
      background-color: ${themeGet("colors.black10")};
    `,
    selected: css`
      border: 2px solid;
      color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.black10")};
      background-color: ${themeGet("colors.black10")};
    `,
  },
  error: {
    resting: css`
      border: 2px solid;
      color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.red100")};
    `,
    selected: css`
      border: 2px solid;
      color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.black100")};
      background-color: ${themeGet("colors.black100")};
    `,
  },
  hover: {
    resting: css`
      border: 2px solid;
      color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.black10")};
      background-color: ${themeGet("colors.black10")};
    `,
    selected: css`
      border: 2px solid;
      color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.black100")};
      background-color: ${themeGet("colors.black100")};
    `,
  },
}

interface RadioDotProps {
  disabled?: boolean
  error?: boolean
  hover?: boolean
  selected?: boolean
}

export const RadioDot: React.FC<RadioDotProps> = (props) => {
  return (
    <Container {...props}>
      <Dot {...props} />
    </Container>
  )
}

const Container = styled(Box)<RadioDotProps>`
  width: 20px;
  height: 20px;
  border-radius: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${(props) => {
    const mode = (() => {
      switch (true) {
        case props.disabled:
          return RADIO_DOT_MODES.disabled
        case props.hover:
          return RADIO_DOT_MODES.hover
        case props.error:
          return RADIO_DOT_MODES.error
        default:
          return RADIO_DOT_MODES.default
      }
    })()

    return props.selected ? mode.selected : mode.resting
  }};
`

const Dot = styled(Box)<RadioDotProps>`
  width: 10px;
  height: 10px;
  border-radius: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${(props) => {
    if (props.disabled && !props.selected) {
      return css`
        background-color: transparent;
      `
    }

    return css`
      background-color: ${themeGet("colors.white100")};
    `
  }};
`
