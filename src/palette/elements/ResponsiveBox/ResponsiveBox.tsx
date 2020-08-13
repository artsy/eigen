import { paddingBottom, scale } from "proportional-scale"
import React from "react"
import { Box, BoxProps } from "../Box"

/** ResponsiveBoxMaxDimensions */
export type ResponsiveBoxMaxDimensions =
  | {
      maxWidth: number
      maxHeight: number
    }
  | { maxWidth: number }
  | { maxHeight: number }
  | { maxWidth: "100%" }

export interface ResponsiveBoxAspectDimensions {
  aspectWidth: number
  aspectHeight: number
}

const responsiveScale = (
  args: ResponsiveBoxAspectDimensions & ResponsiveBoxMaxDimensions
) => {
  if ("maxWidth" in args && args.maxWidth === "100%") {
    return {
      maxWidth: "100%",
      paddingBottom: paddingBottom({
        width: args.aspectWidth,
        height: args.aspectHeight,
      }),
    }
  }

  const { aspectWidth: width, aspectHeight: height, ...rest } = args
  const scaled = scale({ width, height, ...rest })

  return {
    maxWidth: `${scaled.width}px`,
    paddingBottom: scaled.paddingBottom,
  }
}

/** ResponsiveBoxProps */
export type ResponsiveBoxProps = Omit<BoxProps, "maxWidth" | "maxHeight"> &
  ResponsiveBoxAspectDimensions &
  ResponsiveBoxMaxDimensions

/** ResponsiveBox */
export const ResponsiveBox: React.FC<ResponsiveBoxProps> = ({
  aspectWidth,
  aspectHeight,
  children,
  ...rest
}) => {
  const scaled = responsiveScale({ aspectHeight, aspectWidth, ...rest })

  return (
    <Box
      position="relative"
      width="100%"
      style={{ maxWidth: scaled.maxWidth }}
      {...rest}
    >
      <Box
        position="relative"
        width="100%"
        height={0}
        overflow="hidden"
        style={{ paddingBottom: scaled.paddingBottom }}
      />

      <Box position="absolute" top={0} left={0} width="100%" height="100%">
        {children}
      </Box>
    </Box>
  )
}

ResponsiveBox.displayName = "ResponsiveBox"
