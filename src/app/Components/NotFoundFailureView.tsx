import { BackButton } from "app/navigation/BackButton"
import { goBack } from "app/navigation/navigate"
import { useDevToggle } from "app/store/GlobalStore"
import { Button, Flex, Text } from "palette"
import React from "react"
import { JustifyContentValue } from "./Bidding/Elements/types"

interface NotFoundFailureViewProps {
  error?: Error
  justifyContent?: JustifyContentValue
  title?: string
  text?: string
  backButtonText?: string
}

export const NotFoundFailureView: React.FC<NotFoundFailureViewProps> = ({
  error,
  justifyContent = "center",
  title,
  text,
  backButtonText,
}) => {
  const showErrorMessage = useDevToggle("DTShowErrorInLoadFailureView")

  return (
    <>
      <BackButton onPress={() => goBack()} style={{ top: 10 }} />

      <Flex flex={1} m={4} justifyContent={justifyContent} alignItems="center">
        <Text variant="lg" mb="1" textAlign="center">
          {title ?? "Not Found"}
        </Text>
        <Text variant="lg" color="black60" mb="3" textAlign="center">
          {text ?? "Sorry, the resource you were looking for doesn’t exist."}
        </Text>

        <Button variant="outline" block onPress={() => goBack()}>
          {backButtonText ?? "Back"}
        </Button>

        {!!showErrorMessage && (
          <Flex m={2}>
            <Text>Error: {error?.message}</Text>
          </Flex>
        )}
      </Flex>
    </>
  )
}
