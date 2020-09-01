import { ArrowRightIcon, Box, Flex } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"

export const ArrowButton: React.FC<{ onPress: () => void }> = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <Flex flexDirection="row" justifyContent="space-between" width="100%" alignItems="center">
        <Box>{children}</Box>
        <ArrowRightIcon />
      </Flex>
    </TouchableOpacity>
  )
}
