import { CareerHighlightsCardsQuery } from "__generated__/CareerHighlightsCardsQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/navigation/navigate"
import { useSpringValue } from "app/Scenes/Artwork/Components/ImageCarousel/useSpringValue"
import { Flex, useColor, useSpace } from "palette"
import { useState } from "react"
import { Animated } from "react-native"
import Swiper from "react-native-swiper"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { CareerHighlightBigCard } from "./CareerHighlightBigCard"
import { CareerHighlightKind } from "./CareerHighlightCard"
import { CareerHighlightsPromotionalCard } from "./CareerHighlightsPromotionalCard"

export const CareerHighlightsCards: React.FC<{
  type: any
  careerHighlightsAvailableTypes: CareerHighlightKind[]
}> = ({ type, careerHighlightsAvailableTypes }) => {
  const data = useLazyLoadQuery<CareerHighlightsCardsQuery>(CareerHighlightsCardsScreenQuery, {})

  const myCollectionInfo = data.me?.myCollectionInfo

  if (!myCollectionInfo) {
    return null
  }

  const numberOfSlides = careerHighlightsAvailableTypes.length + 1
  const openedCardIndex = careerHighlightsAvailableTypes.indexOf(type)

  const { width: screenWidth } = useScreenDimensions()
  const color = useColor()
  const space = useSpace()

  // 18 is the close button size, 20 is screen margin and 10 is the spase between the
  // close button and the bar
  const barWidth = (screenWidth - 18 - 20 - 20 - 10) / numberOfSlides

  const [sliderState, setSliderState] = useState({ currentPage: openedCardIndex })

  return (
    <>
      <FancyModalHeader
        alignStart
        rightCloseButton
        onRightButtonPress={() => goBack()}
        hideBottomDivider
      >
        <Flex
          px={2}
          style={{
            paddingTop: 4,
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          {Array.from(Array(numberOfSlides).keys()).map((key, index) => (
            <Animated.View
              accessibilityLabel="Career Highlights Pagination Scroll Bar"
              key={key}
              style={{
                height: 2,
                width: barWidth - space(1),
                marginRight: space(1),
                borderRadius: 2,
                backgroundColor: color("black100"),
                opacity: useSpringValue(sliderState.currentPage === index ? 1 : 0.2),
              }}
            />
          ))}
        </Flex>
      </FancyModalHeader>
      <Swiper
        index={openedCardIndex}
        showsButtons={false}
        loop={false}
        removeClippedSubviews={false}
        showsPagination
        onIndexChanged={(index) => setSliderState({ currentPage: index })}
      >
        {!!myCollectionInfo.biennialInsights && (
          <CareerHighlightBigCard
            type="BIENNIAL"
            highlightData={myCollectionInfo.biennialInsights}
          />
        )}
        {!!myCollectionInfo.collectedInsights && (
          <CareerHighlightBigCard
            type="COLLECTED"
            highlightData={myCollectionInfo.collectedInsights}
          />
        )}
        {!!myCollectionInfo.groupShowInsights && (
          <CareerHighlightBigCard
            type="GROUP_SHOW"
            highlightData={myCollectionInfo.groupShowInsights}
          />
        )}
        {!!myCollectionInfo.soloShowInsights && (
          <CareerHighlightBigCard
            type="SOLO_SHOW"
            highlightData={myCollectionInfo.soloShowInsights}
          />
        )}
        {!!myCollectionInfo.reviewedInsights && (
          <CareerHighlightBigCard
            type="REVIEWED"
            highlightData={myCollectionInfo.reviewedInsights}
          />
        )}
        <CareerHighlightsPromotionalCard />
      </Swiper>
    </>
  )
}

export const CareerHighlightsCardsScreenQuery = graphql`
  query CareerHighlightsCardsQuery {
    me {
      myCollectionInfo {
        biennialInsights: artistInsights(kind: BIENNIAL) {
          artist {
            id
            slug
            name
            image {
              url
            }
            birthday
            deathday
            initials
            nationality
          }
          kind
          label
          entities
        }
        collectedInsights: artistInsights(kind: COLLECTED) {
          artist {
            id
            slug
            name
            image {
              url
            }
            birthday
            deathday
            initials
            nationality
          }
          kind
          label
          entities
        }
        groupShowInsights: artistInsights(kind: GROUP_SHOW) {
          artist {
            id
            slug
            name
            image {
              url
            }
            birthday
            deathday
            initials
            nationality
          }
          kind
          label
          entities
        }
        reviewedInsights: artistInsights(kind: REVIEWED) {
          artist {
            id
            slug
            name
            image {
              url
            }
            birthday
            deathday
            initials
            nationality
          }
          kind
          label
          entities
        }
        soloShowInsights: artistInsights(kind: SOLO_SHOW) {
          artist {
            id
            slug
            name
            image {
              url
            }
            birthday
            deathday
            initials
            nationality
          }
          kind
          label
          entities
        }
      }
    }
  }
`
