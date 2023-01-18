import { ArtsyLogoIcon, Button, Flex, Screen, Spacer, Text } from "palette"
import { useOnboardingContext } from "../Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"

export const ArtQuiz = () => {
  const { onDone } = useOnboardingContext()
  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center">
          <ArtsyLogoIcon scale={0.75} />
          <Spacer m={2} />
          <Text variant="xl">Art Taste Quiz</Text>
          <Spacer m={2} />
          <Text variant="md">See more of what you love.</Text>
          <Spacer m={1} />
          <Text variant="md">
            Rate artworks to discover your taste profile and get recommendations tailored to you.
          </Text>
        </Flex>
        <Flex justifyContent="flex-end">
          <Button block>Start the Quiz</Button>
          <Spacer m={0.5} />
          <Button block variant="text" onPress={onDone}>
            Skip
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
