import { Spacer, Button, ArtsyLogoBlackIcon, Flex } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtQuizNavigationStack } from "app/Scenes/ArtQuiz/ArtQuizNavigation"
import { useOnboardingContext } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen, Text } from "palette"

export const ArtQuizWelcome = () => {
  const { onDone } = useOnboardingContext()
  const { navigate } = useNavigation<NavigationProp<ArtQuizNavigationStack>>()

  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center">
          <ArtsyLogoBlackIcon scale={0.75} />
          <Spacer y={2} />
          <Text variant="xl">Art Taste Quiz</Text>
          <Spacer y={2} />
          <Text variant="md">See more of what you love.</Text>
          <Spacer y={1} />
          <Text variant="md">
            Rate artworks to discover your taste profile and get recommendations tailored to you.
          </Text>
        </Flex>
        <Flex justifyContent="flex-end">
          <Button block onPress={() => navigate("ArtQuizArtworks")}>
            Start the Quiz
          </Button>
          <Spacer y={1} />
          <Button
            block
            variant="text"
            onPress={() => {
              onDone()
              // Turn off Art quiz feature flag
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: "ARShowArtQuizApp",
                value: false,
              })
            }}
          >
            Skip
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
