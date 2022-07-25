import { ArtsyLogoIcon, Box, Flex, Screen, Text } from "palette"
import { StatusBar } from "react-native"

export const OnboardingPersonalizationStart: React.FC = () => (
  <Screen>
    <Screen.Background>
      <Flex flex={1} backgroundColor="black100" />
    </Screen.Background>
    <Screen.Body fullwidth>
      <StatusBar barStyle="light-content" />
      <Flex flex={1} backgroundColor="black100" p={2} justifyContent="center">
        <Box position="absolute" top="44px" left="20px">
          <ArtsyLogoIcon fill="white100" />
        </Box>
        <Text variant="xxl" color="white100">
          Ready to find{"\n"}
          art you love?
        </Text>
      </Flex>
    </Screen.Body>
  </Screen>
)
