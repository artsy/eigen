import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { UnauthenticatedRoutesParams } from "app/Navigation/UnauthenticatedRoutes"

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<UnauthenticatedRoutesParams>>()
  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      <Text variant="lg-display">Sign Up</Text>

      <Spacer y={2} />

      <Button
        onPress={() => {
          navigation.goBack()
        }}
      >
        Go back to Login
      </Button>
    </Flex>
  )
}
