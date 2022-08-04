import { CareerHighlightsBigCardsSwiperQuery } from "__generated__/CareerHighlightsBigCardsSwiperQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/navigation/navigate"
import { useSpringValue } from "app/Scenes/Artwork/Components/ImageCarousel/useSpringValue"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { Flex, useColor, useSpace } from "palette"
import { Suspense, useState } from "react"
import { Animated } from "react-native"
import Swiper from "react-native-swiper"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import {
  CareerHighlightBigCardBiennial,
  CareerHighlightBigCardCollected,
  CareerHighlightBigCardGroupShow,
  CareerHighlightBigCardReviewed,
  CareerHighlightBigCardSoloShow,
} from "./CareerHighlightBigCard"
import { CareerHighlightKind } from "./CareerHighlightCard"
import { CareerHighlightsPromotionalCard } from "./CareerHighlightsPromotionalCard"

export const CareerHighlightsBigCardsSwiper: React.FC<{
  type: CareerHighlightKind
  careerHighlightsAvailableTypes: CareerHighlightKind[]
}> = ({ type, careerHighlightsAvailableTypes }) => {
  const data = useLazyLoadQuery<CareerHighlightsBigCardsSwiperQuery>(
    CareerHighlightsBigCardsSwiperScreenQuery,
    {}
  )

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

  const shouldShowSlide = (slide: CareerHighlightKind) => {
    return careerHighlightsAvailableTypes.includes(slide)
  }
  return (
    <>
      <FancyModalHeader
        alignItems="flex-start"
        rightCloseButton
        onRightButtonPress={() => goBack()}
        hideBottomDivider
      >
        <Flex
          px={2}
          justifyContent="flex-start"
          flexDirection="row"
          style={{
            paddingTop: 4,
          }}
          testID="career-highlighs-big-cards-swiper"
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
      <Suspense fallback={<LoadingSkeleton />}>
        <Swiper
          index={openedCardIndex}
          showsButtons={false}
          loop={false}
          removeClippedSubviews={false}
          showsPagination={false}
          onIndexChanged={(index) => setSliderState({ currentPage: index })}
        >
          {!!shouldShowSlide("BIENNIAL") && (
            <CareerHighlightBigCardBiennial type="BIENNIAL" highlightData={myCollectionInfo} />
          )}
          {!!shouldShowSlide("COLLECTED") && (
            <CareerHighlightBigCardCollected type="COLLECTED" highlightData={myCollectionInfo} />
          )}
          {!!shouldShowSlide("GROUP_SHOW") && (
            <CareerHighlightBigCardGroupShow type="GROUP_SHOW" highlightData={myCollectionInfo} />
          )}
          {!!shouldShowSlide("SOLO_SHOW") && (
            <CareerHighlightBigCardSoloShow type="SOLO_SHOW" highlightData={myCollectionInfo} />
          )}
          {!!shouldShowSlide("REVIEWED") && (
            <CareerHighlightBigCardReviewed type="REVIEWED" highlightData={myCollectionInfo} />
          )}
          <CareerHighlightsPromotionalCard />
        </Swiper>
      </Suspense>
    </>
  )
}

const LoadingSkeleton = () => {
  return (
    <ProvidePlaceholderContext>
      <Flex px={2}>
        <Flex justifyContent="space-between" flexDirection="row" alignItems="center" pb={1}>
          <PlaceholderBox height={60} width={50} />
          <PlaceholderBox width={50} height={50} borderRadius={25} />
        </Flex>
        <PlaceholderBox height={60} width={180} />
      </Flex>
    </ProvidePlaceholderContext>
  )
}

export const CareerHighlightsBigCardsSwiperScreenQuery = graphql`
  query CareerHighlightsBigCardsSwiperQuery {
    me {
      myCollectionInfo {
        ...CareerHighlightBigCardBiennial_myCollectionInfo
        ...CareerHighlightBigCardCollected_myCollectionInfo
        ...CareerHighlightBigCardGroupShow_myCollectionInfo
        ...CareerHighlightBigCardSoloShow_myCollectionInfo
        ...CareerHighlightBigCardReviewed_myCollectionInfo
      }
    }
  }
`
