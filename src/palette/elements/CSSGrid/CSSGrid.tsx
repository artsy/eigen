import styled from "styled-components"
import { grid, GridProps } from "styled-system"
import { Box, BoxProps } from "../Box"

/**
 * All props available to the CSSGrid component
 */
export interface CSSGridProps extends GridProps, BoxProps {}

/**
 * A utility component that encapsulates CSS grid behavior
 */
export const CSSGrid = styled(Box)<CSSGridProps>`
  display: grid;
  ${grid}
`
