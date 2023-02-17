import { Spacer, Flex, Screen, Text, ArtsyLogoBlackIcon } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtQuizWelcomeQuery } from "__generated__/ArtQuizWelcomeQuery.graphql"
import { ArtQuizLoader } from "app/Scenes/ArtQuiz/ArtQuizLoader"
import { ArtQuizNavigationStack } from "app/Scenes/ArtQuiz/ArtQuizNavigation"
import { useOnboardingContext } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { extractNodes } from "app/utils/extractNodes"
import { Button } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const ArtQuizWelcomeScreen = () => {
  const { onDone } = useOnboardingContext()
  const queryResult = useLazyLoadQuery<ArtQuizWelcomeQuery>(artQuizWelcomeQuery, {})
  const { navigate } = useNavigation<NavigationProp<ArtQuizNavigationStack>>()

  const artworks = extractNodes(queryResult.artworksConnection)

  if (!artworks) {
    return null
  }

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
          <Button
            block
            onPress={() => {
              return navigate("ArtQuizArtworks")
            }}
          >
            Start the Quiz
          </Button>
          <Spacer y={1} />
          <Button block variant="text" onPress={onDone}>
            Skip
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

export const ArtQuizWelcome = () => {
  return (
    <Suspense fallback={<ArtQuizLoader />}>
      <ArtQuizWelcomeScreen />
    </Suspense>
  )
}

const artQuizWelcomeQuery = graphql`
  query ArtQuizWelcomeQuery {
    artworksConnection(first: 1) {
      edges {
        node {
          isSaved
        }
      }
    }
  }
`
