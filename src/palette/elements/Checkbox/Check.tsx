import { themeGet } from "@styled-system/theme-get"
import React from "react"
import styled, { css } from "styled-components/native"
import { CheckIcon } from "../../svgs/CheckIcon"
import { Box } from "../Box"

export const CHECK_SIZE = 22

const CHECK_MODES = {
  default: {
    resting: css`
      background-color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.black10")};
    `,
    selected: css`
      background-color: ${themeGet("colors.black100")};
      border-color: ${themeGet("colors.black100")};
    `,
  },
  disabled: {
    resting: css`
      background-color: ${themeGet("colors.black5")};
      border-color: ${themeGet("colors.black10")};
    `,
    selected: css`
      background-color: ${themeGet("colors.black30")};
      border-color: ${themeGet("colors.black30")};
    `,
  },
  error: {
    resting: css`
      background-color: ${themeGet("colors.white100")};
      border-color: ${themeGet("colors.red100")};
    `,
    selected: css`
      background-color: ${themeGet("colors.black100")};
      border-color: ${themeGet("colors.black100")};
    `,
  },
} as const

export interface CheckProps {
  disabled?: boolean
  error?: boolean
  hover?: boolean
  selected?: boolean
}

/** Toggeable check mark */
export const Check: React.FC<CheckProps> = ({ disabled, selected, ...rest }) => {
  return (
    <Container disabled={disabled} selected={selected} {...rest}>
      {!!selected && <CheckIcon fill="white100" />}
    </Container>
  )
}

const Container = styled(Box)<CheckProps>`
  width: ${CHECK_SIZE}px;
  height: ${CHECK_SIZE}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-radius: 1px;

  ${(props) => {
    const mode = (() => {
      switch (true) {
        case props.error:
          return CHECK_MODES.error
        case props.disabled:
          return CHECK_MODES.disabled
        default:
          return CHECK_MODES.default
      }
    })()

    return props.selected ? mode.selected : mode.resting
  }};
`
