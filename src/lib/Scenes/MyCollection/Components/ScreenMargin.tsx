import { Box } from "palette"
import React from "react"
import { View } from "react-native"
import { SpaceProps } from "styled-system"

export const ScreenMargin: React.FC<SpaceProps & { ref?: React.Ref<View> }> = ({ children, ref, ...rest }) => {
  return (
    <Box ref={ref} px={2} {...rest}>
      {children}
    </Box>
  )
}
