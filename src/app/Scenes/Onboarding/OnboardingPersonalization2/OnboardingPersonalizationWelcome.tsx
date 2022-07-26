import { useNavigation } from "@react-navigation/native"
import { OnboardingPersonalizationWelcomeQuery } from "__generated__/OnboardingPersonalizationWelcomeQuery.graphql"
import { ArtsyLogoIcon, Box, Button, Flex, Screen, Text } from "palette"
import { StatusBar } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

export const OnboardingPersonalizationWelcome: React.FC = () => {
  const { navigate } = useNavigation()
  // to be removed, just providing a way to go to the home screen for debugging purposes
  const { onDone } = useOnboardingContext()

  const { me } = useLazyLoadQuery<OnboardingPersonalizationWelcomeQuery>(
    OnboardingPersonalizationWelcomeScreenQuery,
    {}
  )

  return (
    <Screen>
      <Screen.Background>
        <StatusBar barStyle="light-content" />
        <Flex flex={1} backgroundColor="black100" p={2} justifyContent="center">
          <Box position="absolute" top="60px" left="20px">
            <ArtsyLogoIcon fill="white100" />
          </Box>
          <Text variant="xxl" color="white100">
            Welcome{"\n"}
            to Artsy,{"\n"}
            {me?.name}
          </Text>
          {/* to be removed, just providing a navigation example */}
          <Button onPress={() => navigate("NextScreen")}>go to next screen</Button>
          {/* to be removed, just providing a way to go to the home screen for debugging purposes */}
          <Button onPress={onDone}>go to home screen</Button>
        </Flex>
      </Screen.Background>
    </Screen>
  )
}

export const OnboardingPersonalizationWelcomeScreenQuery = graphql`
  query OnboardingPersonalizationWelcomeQuery {
    me {
      name
    }
  }
`
