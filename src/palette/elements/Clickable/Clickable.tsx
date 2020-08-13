import React from "react"
import styled from "styled-components"
import { boxMixin, BoxProps } from "../Box"

/**
 * ClickableProps
 */
export type ClickableProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  BoxProps

/**
 * Clickable is a utility component useful for wrapping things like <div>s
 * without having to deal with the requirements to make the <div> accessible.
 */
export const Clickable = styled.button<ClickableProps>`
  appearance: none;
  padding: 0;
  border: 0;
  background-color: transparent;
  ${boxMixin}
`
