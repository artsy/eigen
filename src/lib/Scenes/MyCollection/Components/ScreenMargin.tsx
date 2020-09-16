import { Box } from "palette"
import React from "react"
import { SpaceProps } from "styled-system"

export const ScreenMargin: React.FC<SpaceProps> = ({ children, ...rest }) => {
  return (
    <Box px={2} {...rest}>
      {children}
    </Box>
  )
}
