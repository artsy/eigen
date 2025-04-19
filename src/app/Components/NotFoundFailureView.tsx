import { Button, Flex, Screen, Text } from "@artsy/palette-mobile"
import * as Sentry from "@sentry/react-native"
import { goBack } from "app/system/navigation/navigate"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useEffect } from "react"

interface NotFoundFailureViewProps {
  error?: Error
  title?: string
  text?: string
  route?: string
  backButtonText?: string
}

export const NotFoundFailureView: React.FC<NotFoundFailureViewProps> = ({
  error,
  title,
  text,
  route,
  backButtonText,
}) => {
  const isDevToggleEnabled = useDevToggle("DTShowErrorInLoadFailureView")
  const showErrorMessage = __DEV__ || isDevToggleEnabled

  useEffect(() => {
    if (route) {
      Sentry.withScope((scope) => {
        scope.setExtra("route", route)
        Sentry.captureMessage("Navigation: Not found", "error")
      })
    }
  }, [])

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Screen.Header onBack={goBack} />

        <Flex flex={1} m={4} justifyContent="center" alignItems="center">
          <Text variant="lg-display" mb={1} textAlign="center">
            {title ?? "Not Found"}
          </Text>
          <Text variant="lg-display" color="mono60" mb={4} textAlign="center">
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
      </Screen.Body>
    </Screen>
  )
}
