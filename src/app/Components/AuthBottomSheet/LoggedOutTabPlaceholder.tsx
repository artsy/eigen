import { Button, Flex, Screen, Text } from "@artsy/palette-mobile"
import { useAuthBottomSheet } from "app/Components/AuthBottomSheet/AuthBottomSheetProvider"
import { AuthIntent } from "app/Components/AuthBottomSheet/AuthBottomSheetTypes"

interface LoggedOutTabPlaceholderProps {
  title: string
  body: string
  ctaLabel?: string
  intent?: AuthIntent
}

export const LoggedOutTabPlaceholder: React.FC<LoggedOutTabPlaceholderProps> = ({
  title,
  body,
  ctaLabel = "Sign up or log in",
  intent = "generic",
}) => {
  const { present } = useAuthBottomSheet()

  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} alignItems="center" justifyContent="center" px={2}>
          <Text variant="lg-display" textAlign="center">
            {title}
          </Text>
          <Text variant="sm" textAlign="center" color="mono60" mt={1}>
            {body}
          </Text>
          <Flex mt={2} width="100%">
            <Button block onPress={() => present({ intent })}>
              {ctaLabel}
            </Button>
          </Flex>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
