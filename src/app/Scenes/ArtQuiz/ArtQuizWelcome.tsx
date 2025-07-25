import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Spacer, Flex, LegacyScreen, Text, Button } from "@artsy/palette-mobile"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { ArtQuizNavigationStack } from "app/Scenes/ArtQuiz/ArtQuiz"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"

export const ArtQuizWelcome = () => {
  // prevents Android users from going back with hardware button
  useBackHandler(() => true)

  const { navigate: quizStackNavigate } = useNavigation<NavigationProp<ArtQuizNavigationStack>>()

  return (
    <LegacyScreen>
      <LegacyScreen.Body>
        <Flex flex={1} justifyContent="center">
          <ArtsyLogoIcon height={24} width={70} />
          <Spacer y={2} />
          <Text variant="xl">What's your art taste?</Text>
          <Spacer y={2} />
          <Text variant="md">Let us be your art advisor.</Text>
          <Spacer y={1} />
          <Text variant="md">Rate artworks and get recommendations tailored to you.</Text>
        </Flex>
        <Flex justifyContent="flex-end">
          <Button block onPress={() => quizStackNavigate("ArtQuizArtworks")}>
            Start the Quiz
          </Button>
          <Spacer y={1} />
          <Button
            block
            variant="text"
            onPress={() => {
              GlobalStore.actions.onboarding.setArtQuizState("complete")
              navigate("/", {
                replaceActiveScreen: true,
              })
            }}
          >
            Skip
          </Button>
        </Flex>
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}
