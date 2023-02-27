import { Touchable, Flex, Screen, Text, BackButton } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtQuizArtworksDislikeMutation } from "__generated__/ArtQuizArtworksDislikeMutation.graphql"
import { ArtQuizArtworksQuery } from "__generated__/ArtQuizArtworksQuery.graphql"
import { ArtQuizArtworksSaveMutation } from "__generated__/ArtQuizArtworksSaveMutation.graphql"
import { ArtQuizArtworksUpdateQuizMutation } from "__generated__/ArtQuizArtworksUpdateQuizMutation.graphql"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { ArtQuizButton } from "app/Scenes/ArtQuiz/ArtQuizButton"
import { ArtQuizLoader } from "app/Scenes/ArtQuiz/ArtQuizLoader"
import { ArtQuizNavigationStack } from "app/Scenes/ArtQuiz/ArtQuizNavigation"
import { useOnboardingContext } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate as globalNavigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Suspense, useEffect, useRef, useState } from "react"
import { Image } from "react-native"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"
import { graphql, useLazyLoadQuery, useMutation } from "react-relay"

export const ArtQuizResultsScreen = () => {
  const queryResult = useLazyLoadQuery<ArtQuizArtworksQuery>(artQuizArtworksQuery, {})
  const { userID } = GlobalStore.useAppState((store) => store.auth)

  const artworks = extractNodes(queryResult.me?.quiz.quizArtworkConnection)
  const lastInteractedArtworkIndex = queryResult.me?.quiz.quizArtworkConnection?.edges?.findIndex(
    (edge) => edge?.interactedAt === null
  )
  const [activeCardIndex, setActiveCardIndex] = useState(lastInteractedArtworkIndex ?? 0)
  const pagerViewRef = useRef<PagerView>(null)
  const popoverMessage = usePopoverMessage()

  const { goBack, navigate } = useNavigation<NavigationProp<ArtQuizNavigationStack>>()
  const { onDone } = useOnboardingContext()

  const [submitDislike] = useMutation<ArtQuizArtworksDislikeMutation>(DislikeArtworkMutation)
  const [submitSave] = useMutation<ArtQuizArtworksSaveMutation>(SaveArtworkMutation)
  const [submitUpdate] = useMutation<ArtQuizArtworksUpdateQuizMutation>(UpdateQuizMutation)

  useEffect(() => {
    popoverMessage.show({
      title: `Like it? Hit the heart.${"\n"}Not for you? Choose X.`,
      placement: "bottom",
      withPointer: "bottom",
      style: { width: "70%", marginBottom: 100, left: 55 },
    })
    if (activeCardIndex !== 0) {
      popoverMessage.hide()
    }
  }, [])

  const handleIndexChange = (e: PagerViewOnPageScrollEvent) => {
    if (e.nativeEvent.position !== undefined) {
      // We need to avoid updating the index when the position is -1. This happens when the user
      // scrolls left on the first page in iOS when the overdrag is enabled,
      if (e.nativeEvent.position !== -1) {
        setActiveCardIndex(e.nativeEvent.position)
      }
    }
  }

  const handleNext = (action: "Like" | "Dislike") => {
    popoverMessage.hide()
    pagerViewRef.current?.setPage(activeCardIndex + 1)

    const currentArtwork = artworks[activeCardIndex]

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

    if (activeCardIndex + 1 === artworks.length) {
      navigate("ArtQuizResults", { isCalculatingResult: true })
      return
    }
  }

  const handleOnBack = () => {
    popoverMessage.hide()
    if (activeCardIndex === 0) {
      goBack()
    } else {
      const previousArtwork = artworks[activeCardIndex - 1]

      pagerViewRef.current?.setPage(activeCardIndex - 1)
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
    onDone?.()
    popoverMessage.hide()
    globalNavigate("/")
  }

  return (
    <Screen>
      <Screen.RawHeader>
        <Flex
          height={44}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          px={2}
        >
          <Flex>
            <BackButton onPress={handleOnBack} />
          </Flex>
          <Text>{`${activeCardIndex + 1}/${artworks.length}`}</Text>
          <Touchable haptic="impactLight" onPress={handleOnSkip}>
            <Flex height="100%" justifyContent="center">
              <Text textAlign="right" variant="xs">
                Skip
              </Text>
            </Flex>
          </Touchable>
        </Flex>
      </Screen.RawHeader>
      <Screen.Body>
        <Flex flex={1} py={2}>
          <PagerView
            ref={pagerViewRef}
            style={{ flex: 1 }}
            initialPage={activeCardIndex}
            onPageScroll={handleIndexChange}
            overdrag
          >
            {artworks.map((artwork) => {
              return (
                <Flex key={artwork.internalID}>
                  <Image
                    source={{ uri: artwork.imageUrl! }}
                    style={{ flex: 1 }}
                    resizeMode="contain"
                  />
                </Flex>
              )
            })}
          </PagerView>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-around" mb={6} mx={4}>
          <ArtQuizButton variant="Dislike" onPress={() => handleNext("Dislike")} />
          <ArtQuizButton variant="Like" onPress={() => handleNext("Like")} />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

export const ArtQuizArtworks = () => {
  return (
    <Suspense fallback={<ArtQuizLoader />}>
      <ArtQuizResultsScreen />
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
              imageUrl
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
