import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtQuizArtworksDislikeMutation } from "__generated__/ArtQuizArtworksDislikeMutation.graphql"
import { ArtQuizArtworksQuery } from "__generated__/ArtQuizArtworksQuery.graphql"
import { ArtQuizArtworksSaveMutation } from "__generated__/ArtQuizArtworksSaveMutation.graphql"
import { ArtQuizArtworksUpdateQuizMutation } from "__generated__/ArtQuizArtworksUpdateQuizMutation.graphql"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { useOnboardingContext } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { CloseIcon, Flex, HeartIcon, Screen, Spacer, Touchable } from "palette"
import { useEffect, useRef, useState } from "react"
import { Image } from "react-native"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"
import { graphql, useLazyLoadQuery, useMutation } from "react-relay"
import { ArtQuizNavigationStack } from "./ArtQuiz"

export const ArtQuizArtworks = () => {
  const { goBack, navigate } = useNavigation<NavigationProp<ArtQuizNavigationStack>>()
  const { onDone } = useOnboardingContext()
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const artQuizArtworksQueryResult = useLazyLoadQuery<ArtQuizArtworksQuery>(
    artQuizArtworksQuery,
    {}
  )
  const { userID } = GlobalStore.useAppState((store) => store.auth)
  const artworks = extractNodes(artQuizArtworksQueryResult.me?.quiz.quizArtworkConnection)
  const pagerViewRef = useRef<PagerView>(null)
  const popoverMessage = usePopoverMessage()

  const currentArtwork = artworks[activeCardIndex]
  const previousArtwork = artworks[activeCardIndex - 1]

  const [submitDislike] = useMutation<ArtQuizArtworksDislikeMutation>(DislikeArtworkMutation)
  const [submitSave] = useMutation<ArtQuizArtworksSaveMutation>(SaveArtworkMutation)
  const [submitUpdate] = useMutation<ArtQuizArtworksUpdateQuizMutation>(UpdateQuizMutation)

  useEffect(() => {
    popoverMessage.show({
      title: `Like it? Hit the heart.${"\n"}Not for you? Choose X.`,
      placement: "bottom",
      withPointer: "bottom",
      style: { width: "70%", marginBottom: 80, left: 55 },
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

    if (activeCardIndex + 1 === mockArtworks.length) {
      navigate("ArtQuizResults")
      return
    }

    pagerViewRef.current?.setPage(activeCardIndex + 1)

    // if (action === "Like") {
    //   submitSave({
    //     variables: {
    //       input: {
    //         artworkID: currentArtwork.internalID,
    //       },
    //     },
    //   })
    // }

    // if (action === "Dislike") {
    //   submitDislike({
    //     variables: {
    //       input: {
    //         artworkID: currentArtwork.internalID,
    //         remove: false,
    //       },
    //     },
    //   })
    // }

    // submitUpdate({
    //   variables: {
    //     input: {
    //       artworkId: currentArtwork.internalID,
    //       userId: userID!,
    //     },
    //   },
    // })
  }

  const handleOnBack = () => {
    popoverMessage.hide()
    if (activeCardIndex === 0) {
      goBack()
    } else {
      pagerViewRef.current?.setPage(activeCardIndex - 1)
      const { isSaved, isDisliked } = previousArtwork

      // if (isSaved) {
      //   submitSave({
      //     variables: {
      //       input: {
      //         artworkID: previousArtwork.internalID,
      //         remove: true,
      //       },
      //     },
      //   })
      // }

      // if (isDisliked) {
      //   submitDislike({
      //     variables: {
      //       input: {
      //         artworkID: previousArtwork.internalID,
      //         remove: true,
      //       },
      //     },
      //   })
      // }

      // submitUpdate({
      //   variables: {
      //     input: {
      //       artworkId: previousArtwork.internalID,
      //       userId: userID!,
      //       clearInteraction: true,
      //     },
      //   },
      // })
    }
  }

  const handleOnSkip = () => {
    onDone()
    // Turn off Art quiz feature flag
    GlobalStore.actions.artsyPrefs.features.setLocalOverride({
      key: "ARShowArtQuizApp",
      value: false,
    })
    popoverMessage.hide()
  }

  const mockArtworks = [
    {
      internalID: 1,
      imageUrl:
        "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      internalID: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym9va3xlbnwwfHwwfHw%3D&w=1000&q=80",
    },
    {
      internalID: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80",
    },
    {
      internalID: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80",
    },
    {
      internalID: 5,
      imageUrl:
        "https://www.istockphoto.com/resources/images/PhotoFTLP/P4-JAN-iStock-1432854572.jpg",
    },
    {
      internalID: 6,
      imageUrl:
        "https://media.istockphoto.com/id/157692655/photo/i-crush-you.jpg?s=612x612&w=0&k=20&c=NULhua4fjqhI6_NouyOqIpT7VXUBn3LXiOD5isVDGqY=",
    },
    {
      internalID: 7,
      imageUrl:
        "https://media.istockphoto.com/id/471774763/photo/business-men-hiding-head-in-sand.jpg?s=170x170&k=20&c=X2upa11XjVExOfhD1z-TCX3lYVPssvDtbGc6pKslGHE=",
    },
  ]

  return (
    <Screen>
      <Screen.Header
        onBack={handleOnBack}
        title={`${activeCardIndex + 1}/${mockArtworks.length}`}
        onSkip={handleOnSkip}
      />
      <Screen.Body>
        <Flex flex={1} py={2}>
          <PagerView
            ref={pagerViewRef}
            style={{ flex: 1 }}
            initialPage={activeCardIndex}
            onPageScroll={handleIndexChange}
            overdrag
          >
            {mockArtworks.map((artwork) => {
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
        <Flex justifyContent="flex-end">
          <Flex flexDirection="row" justifyContent="center" px={4}>
            <Touchable onPress={() => handleNext("Dislike")}>
              <CloseIcon height={40} width={50} />
            </Touchable>
            <Spacer m={3} />
            <Touchable onPress={() => handleNext("Like")}>
              <HeartIcon height={40} width={50} />
            </Touchable>
          </Flex>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

const artQuizArtworksQuery = graphql`
  query ArtQuizArtworksQuery {
    me {
      quiz {
        quizArtworkConnection(first: 16) {
          edges {
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
