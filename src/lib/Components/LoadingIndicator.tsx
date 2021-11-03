import { Box, Flex } from "palette"
import React from "react"
import { ActivityIndicator } from "react-native"

export const LoadingIndicator = () => {
  return (
    <Box
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
      }}
    >
      <Flex flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
      </Flex>
    </Box>
  )
}
