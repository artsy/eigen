import { Box, BoxProps } from "palette"
import React from "react"
import Svg, { Path } from "react-native-svg"

export const TriangleDown: React.FC<BoxProps> = (props) => {
  return (
    <Box {...props}>
      <Svg width="11" height="6" viewBox="0 0 11 6" fill="none">
        <Path fillRule="evenodd" clip-rule="evenodd" d="M5.5 6L0 0L11 0L5.5 6Z" fill="black" />
      </Svg>
    </Box>
  )
}
