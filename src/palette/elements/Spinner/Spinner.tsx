// @ts-ignore
import React, { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { color } from "../../helpers"
import { getSize, SpinnerProps } from "./Spinner.shared"

const spin = keyframes`
  100% {
    transform: rotate(360deg)
  }
`

/** Generic Spinner component */
export const Spinner: React.FC<SpinnerProps> = props => {
  const [show, setShow] = useState(props.delay === 0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, props.delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  if (!show) {
    return null
  }

  return <SpinnerBar {...props} />
}

const SpinnerBar = styled.div<SpinnerProps>`
  animation: ${spin} 1s infinite linear;
  position: absolute;

  ${props => {
    const { width, height } = getSize(props)

    return `
      background: ${color(props.color)};
      width: ${width}px;
      height: ${height}px;
      top: calc(50% - ${height}px / 2);
      left: calc(50% - ${width}px / 2);
    `
  }};
`

Spinner.defaultProps = {
  delay: 0,
  width: 25,
  height: 6,
  color: "black100",
}

Spinner.displayName = "Spinner"
