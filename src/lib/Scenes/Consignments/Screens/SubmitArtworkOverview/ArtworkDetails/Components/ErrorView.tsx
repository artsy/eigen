import { Flex, Text } from "palette"
import React from "react"

interface Props {
  message?: string
}

export const ErrorView: React.FC<Props> = ({ message }) => (
  <Flex alignItems="center" justifyContent="center" height="100%">
    <Flex maxWidth={280}>
      <Text variant="sm" textAlign="center">
        {message ||
          "There seems to be a problem with submission creation. Please try again shortly."}
      </Text>
    </Flex>
  </Flex>
)
