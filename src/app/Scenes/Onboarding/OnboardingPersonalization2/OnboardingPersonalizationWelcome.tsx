import { OnboardingPersonalizationWelcomeQuery } from "__generated__/OnboardingPersonalizationWelcomeQuery.graphql"
import { ArtsyLogoIcon, Box, Flex, Screen, Text } from "palette"
import { StatusBar } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

export const OnboardingPersonalizationWelcome: React.FC = () => {
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
          <Box />
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
