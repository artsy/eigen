import { Touchable, Flex, Text, useScreenDimensions, useSpace, Screen } from "@artsy/palette-mobile"
import { ArtQuizArtworksDislikeMutation } from "__generated__/ArtQuizArtworksDislikeMutation.graphql"
import { ArtQuizArtworksQuery } from "__generated__/ArtQuizArtworksQuery.graphql"
import { ArtQuizArtworksSaveMutation } from "__generated__/ArtQuizArtworksSaveMutation.graphql"
import { ArtQuizArtworksUpdateQuizMutation } from "__generated__/ArtQuizArtworksUpdateQuizMutation.graphql"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { Card } from "app/Components/FancySwiper/FancySwiperCard"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { ArtQuizLoader } from "app/Scenes/ArtQuiz/ArtQuizLoader"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { isEmpty } from "lodash"
import { Suspense, useEffect, useState } from "react"
import { Image } from "react-native"

import { graphql, useLazyLoadQuery, useMutation } from "react-relay"

const ArtQuizArtworksScreen = () => {
  const queryResult = useLazyLoadQuery<ArtQuizArtworksQuery>(artQuizArtworksQuery, {})
  const { userID } = GlobalStore.useAppState((store) => store.auth)
  const { width } = useScreenDimensions()
  const space = useSpace()
  const artworks = extractNodes(queryResult.me?.quiz.quizArtworkConnection)

  const lastInteractedArtworkIndex = queryResult.me?.quiz.quizArtworkConnection?.edges?.findIndex(
    (edge) => edge?.interactedAt === null
  )
  const [activeCardIndex, setActiveCardIndex] = useState(lastInteractedArtworkIndex ?? 0)
  const popoverMessage = usePopoverMessage()

  const [submitDislike] = useMutation<ArtQuizArtworksDislikeMutation>(DislikeArtworkMutation)
  const [submitSave] = useMutation<ArtQuizArtworksSaveMutation>(SaveArtworkMutation)
  const [submitUpdate] = useMutation<ArtQuizArtworksUpdateQuizMutation>(UpdateQuizMutation)

  useEffect(() => {
    popoverMessage.show({
      title: `Like it? Hit the heart.${"\n"}Not for you? Choose X.`,
      placement: "bottom",
      withPointer: "bottom",
      style: { width: "70%", marginBottom: 65, left: 55 },
    })
    if (activeCardIndex !== 0) {
      popoverMessage.hide()
    }
  }, [])

  const handleSwipe = (swipeDirection: "left" | "right") => {
    handleNext(swipeDirection === "right" ? "Like" : "Dislike", activeCardIndex)

    // No need to swipe through the last card, just navigate to the results screen
    if (activeCardIndex + 1 < artworks.length) {
      setActiveCardIndex(activeCardIndex + 1)
    }
  }

  const handleNext = (action: "Like" | "Dislike", activeIndex: number) => {
    popoverMessage.hide()

    const currentArtwork = artworks[activeIndex]

    if (isEmpty(currentArtwork)) {
      return
    }

    if (action === "Like") {
      submitSave({
        variables: {
          input: {
            artworkID: currentArtwork.internalID,
          },
        },
      })
    }

    if (action === "Dislike") {
      submitDislike({
        variables: {
          input: {
            artworkID: currentArtwork.internalID,
            remove: false,
          },
        },
      })
    }

    submitUpdate({
      variables: {
        input: {
          artworkId: currentArtwork.internalID,
          userId: userID!,
        },
      },
    })

    if (activeIndex + 1 === artworks.length) {
      navigate("/art-quiz/results", {
        replaceActiveScreen: true,
        passProps: {
          isCalculatingResult: true,
        },
      })
    }
  }

  const handleOnBack = () => {
    popoverMessage.hide()
    if (activeCardIndex === 0) {
      goBack()
    } else {
      const previousArtwork = artworks[activeCardIndex - 1]

      setActiveCardIndex(activeCardIndex - 1)

      const { isSaved, isDisliked } = previousArtwork

      if (isSaved) {
        submitSave({
          variables: {
            input: {
              artworkID: previousArtwork.internalID,
              remove: true,
            },
          },
        })
      }

      if (isDisliked) {
        submitDislike({
          variables: {
            input: {
              artworkID: previousArtwork.internalID,
              remove: true,
            },
          },
        })
      }

      submitUpdate({
        variables: {
          input: {
            artworkId: previousArtwork.internalID,
            userId: userID!,
            clearInteraction: true,
          },
        },
      })
    }
  }

  const handleOnSkip = () => {
    popoverMessage.hide()
    navigate("/", {
      replaceActiveScreen: true,
    })
  }

  const artworkCards: Card[] = artworks.slice(activeCardIndex).map((artwork) => {
    return {
      jsx: (
        <Flex width={width - space(4)} height={500} backgroundColor="white">
          <Image
            source={{ uri: artwork.image?.resized?.src }}
            style={{ flex: 1 }}
            resizeMode="contain"
          />
        </Flex>
      ),
      id: artwork.internalID,
    }
  })

  return (
    <Screen>
      <Screen.Header
        onBack={handleOnBack}
        title={`${activeCardIndex + 1}/${artworks.length}`}
        rightElements={
          <Touchable haptic="impactLight" onPress={handleOnSkip}>
            <Flex height="100%" justifyContent="center">
              <Text textAlign="right" variant="xs">
                Close
              </Text>
            </Flex>
          </Touchable>
        }
      />

      <Screen.Body>
        <FancySwiper
          cards={artworkCards}
          onSwipeRight={() => handleSwipe("right")}
          onSwipeLeft={() => handleSwipe("left")}
        />
      </Screen.Body>
    </Screen>
  )
}

export const ArtQuizArtworks = () => {
  return (
    <Suspense fallback={<ArtQuizLoader />}>
      <ArtQuizArtworksScreen />
    </Suspense>
  )
}

const artQuizArtworksQuery = graphql`
  query ArtQuizArtworksQuery {
    me {
      quiz {
        quizArtworkConnection(first: 16) {
          edges {
            interactedAt
            position
            node {
              internalID
              image {
                resized(width: 900, height: 900, version: ["normalized", "larger", "large"]) {
                  src
                }
              }
              isDisliked
              isSaved
            }
          }
        }
      }
    }
  }
`

const DislikeArtworkMutation = graphql`
  mutation ArtQuizArtworksDislikeMutation($input: DislikeArtworkInput!) {
    dislikeArtwork(input: $input) {
      artwork {
        isDisliked
      }
    }
  }
`

const SaveArtworkMutation = graphql`
  mutation ArtQuizArtworksSaveMutation($input: SaveArtworkInput!) {
    saveArtwork(input: $input) {
      artwork {
        isSaved
      }
    }
  }
`

const UpdateQuizMutation = graphql`
  mutation ArtQuizArtworksUpdateQuizMutation($input: updateQuizMutationInput!) {
    updateQuiz(input: $input) {
      quiz {
        completedAt
      }
    }
  }
`
