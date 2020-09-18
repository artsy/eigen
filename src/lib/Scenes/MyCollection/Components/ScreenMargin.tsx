import { Box } from "palette"
import React from "react"
import { View } from "react-native"
import { SpaceProps } from "styled-system"

interface ScreenMarginProps extends SpaceProps {
  ref?: React.Ref<View>
}

export const ScreenMargin: React.FC<ScreenMarginProps> = ({ children, ref, ...rest }) => {
  return (
    <Box ref={ref} px={2} {...rest}>
      {children}
    </Box>
  )
}
