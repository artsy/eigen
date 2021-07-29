import styled from "styled-components/native"
import { Box, BoxProps } from "../Box"

/**
 * Flex is Box with display: flex
 */
export type FlexProps = BoxProps

/**
 * Flex is Box with display: flex
 */
export const Flex = styled(Box)<FlexProps>``

Flex.defaultProps = {
  display: "flex",
}

Flex.displayName = "Flex"
