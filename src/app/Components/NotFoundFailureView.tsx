import { useDevToggle } from "app/store/GlobalStore"
import { BackButton } from "app/system/navigation/BackButton"
import { goBack } from "app/system/navigation/navigate"
import { Button, Flex, Text } from "palette"

interface NotFoundFailureViewProps {
  error?: Error
  title?: string
  text?: string
  backButtonText?: string
}

export const NotFoundFailureView: React.FC<NotFoundFailureViewProps> = ({
  error,
  title,
  text,
  backButtonText,
}) => {
  const showErrorMessage = __DEV__ || useDevToggle("DTShowErrorInLoadFailureView")

  return (
    <>
      <BackButton onPress={() => goBack()} style={{ top: 10 }} />

      <Flex flex={1} m={4} justifyContent="center" alignItems="center">
        <Text variant="lg-display" mb="1" textAlign="center">
          {title ?? "Not Found"}
        </Text>
        <Text variant="lg-display" color="black60" mb="4" textAlign="center">
          {text ?? "Sorry, the resource you were looking for doesn’t exist."}
        </Text>

        <Button variant="outline" block onPress={() => goBack()}>
          {backButtonText ?? "Back"}
        </Button>

        {!!showErrorMessage && (
          <Flex my={2}>
            <Text>Error: {error?.message}</Text>
          </Flex>
        )}
      </Flex>
    </>
  )
}
