import { Spacer, Flex, Screen, Text, ArtsyLogoBlackIcon } from "@artsy/palette-mobile"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { ArtQuizNavigationStack } from "app/Scenes/ArtQuiz/ArtQuiz"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { Button } from "app/Components/Button"
import { useBackHandler } from "app/utils/hooks/useBackHandler"

export const ArtQuizWelcome = () => {
  // prevents Android users from going back with hardware button
  useBackHandler(() => true)

  const { navigate: quizStackNavigate } = useNavigation<NavigationProp<ArtQuizNavigationStack>>()

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
          <Button block onPress={() => quizStackNavigate("ArtQuizArtworks")}>
            Start the Quiz
          </Button>
          <Spacer y={1} />
          <Button
            block
            variant="text"
            onPress={() => {
              GlobalStore.actions.auth.setArtQuizState("complete")
              navigate("/")
            }}
          >
            Skip
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
