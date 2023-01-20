import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtQuizArtworksQuery } from "__generated__/ArtQuizArtworksQuery.graphql"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { CloseIcon, Flex, HeartIcon, Screen, Spacer, Touchable } from "palette"
import { useEffect, useRef, useState } from "react"
import { Image } from "react-native"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useOnboardingContext } from "../Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { ArtQuizNavigationStack } from "./ArtQuiz"

export const ArtQuizArtworks = () => {
  const { goBack } = useNavigation<NavigationProp<ArtQuizNavigationStack>>()
  const { onDone } = useOnboardingContext()
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const artQuizArtworksQueryResult = useLazyLoadQuery<ArtQuizArtworksQuery>(
    artQuizArtworksQuery,
    {}
  )
  const artworks = extractNodes(artQuizArtworksQueryResult.me?.quiz.quizArtworkConnection)
  const pagerViewRef = useRef<PagerView>(null)
  const popoverMessage = usePopoverMessage()

  const handleIndexChange = (e: PagerViewOnPageScrollEvent) => {
    if (e.nativeEvent.position !== undefined) {
      // We need to avoid updating the index when the position is -1. This happens when the user
      // scrolls left on the first page in iOS when the overdrag is enabled,
      if (e.nativeEvent.position !== -1) {
        console.log("e.nativeEvent.position ", e.nativeEvent.position)
        setActiveCardIndex(e.nativeEvent.position)
      }
    }
  }

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

  const handleNext = (action: "Like" | "Dislike") => {
    console.log("Action : ", action)
    console.log("activeCardIndex ", activeCardIndex)

    pagerViewRef.current?.setPage(activeCardIndex + 1)
    if (activeCardIndex + 1 !== artworks.length) {
      setActiveCardIndex(activeCardIndex + 1)
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

  return (
    <Screen>
      <Screen.Header
        onBack={() => goBack()}
        title={`${activeCardIndex + 1}/${artworks.length}`}
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
            {artworks.map((artwork) => {
              return (
                <Flex key={artwork.id}>
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
        {/* TODO: Replace the below code with Popover component https://github.com/artsy/palette/pull/1242*/}
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
              id
              imageUrl
            }
          }
        }
      }
    }
  }
`
