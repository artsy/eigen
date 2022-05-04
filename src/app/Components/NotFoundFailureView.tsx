import { useDevToggle } from "app/store/GlobalStore"
import { Flex, Text } from "palette"
import React from "react"
import { JustifyContentValue } from "./Bidding/Elements/types"

interface NotFoundFailureViewProps {
  error?: Error
  justifyContent?: JustifyContentValue
  notFoundMessage?: string
}

export const NotFoundFailureView: React.FC<NotFoundFailureViewProps> = ({
  error,
  justifyContent = "center",
  notFoundMessage,
}) => {
  const showErrorMessage = __DEV__ || useDevToggle("DTShowErrorInLoadFailureView")

  return (
    <Flex flex={1} justifyContent={justifyContent} alignItems="center">
      <Text variant="lg" mb="2">
        Not found.
      </Text>
      <Text variant="md" mb="1">
        {notFoundMessage ?? "Sorry, the resource you were looking for doesn’t exist."}
      </Text>

      {!!showErrorMessage && (
        <Flex m={2}>
          <Text>Error: {error?.message}</Text>
        </Flex>
      )}
    </Flex>
  )
}
