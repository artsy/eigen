import { color } from "@artsy/palette-tokens"
import React from "react"
import styled, { css } from "styled-components/native"
import { CheckIcon } from "../../svgs"
import { Box } from "../Box"

const CHECK_MODES = {
  default: {
    resting: css`
      background-color: ${color("white100")};
      border-color: ${color("black10")};
    `,
    selected: css`
      background-color: ${color("black100")};
      border-color: ${color("black100")};
    `,
  },
  disabled: {
    resting: css`
      background-color: ${color("black5")};
      border-color: ${color("black10")};
    `,
    selected: css`
      background-color: ${color("black30")};
      border-color: ${color("black30")};
    `,
  },
  error: {
    resting: css`
      background-color: ${color("white100")};
      border-color: ${color("red100")};
    `,
    selected: css`
      background-color: ${color("black100")};
      border-color: ${color("black100")};
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
  width: 22px;
  height: 22px;
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
