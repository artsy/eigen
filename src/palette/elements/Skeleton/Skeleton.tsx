import React from "react"
import styled, { css, keyframes } from "styled-components"
import { border, BorderProps } from "styled-system"
import { color } from "../../helpers"
import { splitProps } from "../../utils/splitProps"
import { Box, BoxProps } from "../Box"
import { Text, TextProps } from "../Text"

const PULSE = keyframes`
  0% { background-color: ${color("black10")}; }
  50% { background-color: ${color("black5")}; }
  100% { background-color: ${color("black10")}; }
`

interface DoneProps {
  done?: boolean
}

const Skeleton = styled(Box)<DoneProps>`
  ${({ done }) =>
    done
      ? css`
          background-color: ${color("black10")};
        `
      : css`
          animation: ${PULSE} 2s ease-in-out infinite;
        `}
`

/** SkeletonProps */
export type SkeletonBoxProps = BoxProps & DoneProps

/** Skeleton */
export const SkeletonBox: React.FC<SkeletonBoxProps> = ({ done, ...rest }) => {
  return <Skeleton aria-busy={!done} done={done} borderRadius={2} {...rest} />
}

const splitBorderProps = splitProps<BorderProps>(border)

/** SkeletonTextProps */
export type SkeletonTextProps = TextProps & {
  done?: boolean
}

const SkeletonTextOverlay = styled(SkeletonBox)`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 85%;
  transform: translateY(-50%);
`

/** SkeletonText */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  children,
  done,
  ...rest
}) => {
  const [borderProps, notBorderProps] = splitBorderProps(rest)

  return (
    <Text aria-busy={!done} {...notBorderProps}>
      <Box
        as="span"
        display="inline-flex"
        position="relative"
        aria-hidden="true"
      >
        {children}

        <SkeletonTextOverlay {...borderProps} />
      </Box>
    </Text>
  )
}
