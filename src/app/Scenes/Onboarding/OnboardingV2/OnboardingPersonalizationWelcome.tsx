import { useNavigation } from "@react-navigation/native"
import { OnboardingPersonalizationWelcomeQuery } from "__generated__/OnboardingPersonalizationWelcomeQuery.graphql"
import { ArtsyLogoIcon, Box, Button, Flex, Screen, Text } from "palette"
import { StatusBar } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

export const OnboardingPersonalizationWelcome: React.FC = () => {
  const { me } = useLazyLoadQuery<OnboardingPersonalizationWelcomeQuery>(
    OnboardingPersonalizationWelcomeScreenQuery,
    {}
  )

  const { navigate } = useNavigation()
  const { onDone } = useOnboardingContext()

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
          {/* TODO: To be removed, for now this is for us to be able to go through the flow  */}
          <Flex position="absolute" paddingBottom={2} left={2} bottom={10} alignItems="center">
            <Button
              accessible
              accessibilityLabel="Start Onboarding Quiz"
              accessibilityHint="Starts the Onboarding Quiz"
              variant="fillLight"
              block
              haptic="impactMedium"
              onPress={() => {
                // @ts-expect-error
                navigate("OnboardingQuestionOne")
              }}
            >
              Get Started
            </Button>
            <Button
              accessible
              accessibilityLabel="Skip Onboarding Quiz"
              accessibilityHint="Navigates to the home screen"
              variant="fillDark"
              block
              haptic="impactMedium"
              onPress={onDone}
            >
              Skip
            </Button>
          </Flex>
          {/* TODO: To be removed END */}
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
