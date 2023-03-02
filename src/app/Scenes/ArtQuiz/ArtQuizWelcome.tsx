import { Spacer, Flex, Screen, Text, ArtsyLogoBlackIcon } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { Button } from "palette"

export const ArtQuizWelcome = () => {
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
          <Button block onPress={() => navigate("/art-quiz/artworks")}>
            Start the Quiz
          </Button>
          <Spacer y={1} />
          <Button
            block
            variant="text"
            onPress={() => {
              GlobalStore.actions.auth.setArtQuizState("close")
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
