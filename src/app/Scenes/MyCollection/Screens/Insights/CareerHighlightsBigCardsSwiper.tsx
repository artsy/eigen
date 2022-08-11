import { CareerHighlightsBigCardsSwiperQuery } from "__generated__/CareerHighlightsBigCardsSwiperQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/navigation/navigate"
import { useSpringValue } from "app/Scenes/Artwork/Components/ImageCarousel/useSpringValue"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { compact } from "lodash"
import { Flex, useColor, useSpace } from "palette"
import { Suspense, useState } from "react"
import { Animated, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native"
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

interface Slides {
  key: CareerHighlightKind | "promoCard"
  content: JSX.Element
}

export const CareerHighlightsBigCardsSwiper: React.FC<{
  type: CareerHighlightKind
  careerHighlightsAvailableTypes: CareerHighlightKind[]
  openPromoCard: boolean
}> = ({ type, careerHighlightsAvailableTypes, openPromoCard }) => {
  const color = useColor()
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()

  const data = useLazyLoadQuery<CareerHighlightsBigCardsSwiperQuery>(
    CareerHighlightsBigCardsSwiperScreenQuery,
    {}
  )

  const myCollectionInfo = data.me?.myCollectionInfo

  if (!myCollectionInfo) {
    return null
  }

  const numberOfSlides = careerHighlightsAvailableTypes.length + 1
  const openedCardIndex = openPromoCard
    ? careerHighlightsAvailableTypes.length
    : careerHighlightsAvailableTypes.indexOf(type)

  // 18 is the close button size, 20 is screen margin and 10 is the spase between the
  // close button and the bar
  const barWidth = (screenWidth - 18 - 20 - 20 - 10) / numberOfSlides

  const [sliderState, setSliderState] = useState({ currentPage: openedCardIndex })

  const shouldShowSlide = (slide: CareerHighlightKind) => {
    return careerHighlightsAvailableTypes.includes(slide)
  }

  const slides: Slides[] = compact([
    !!shouldShowSlide("BIENNIAL") && {
      key: "BIENNIAL",
      content: <CareerHighlightBigCardBiennial type="BIENNIAL" highlightData={myCollectionInfo} />,
    },

    !!shouldShowSlide("COLLECTED") && {
      key: "COLLECTED",
      content: (
        <CareerHighlightBigCardCollected type="COLLECTED" highlightData={myCollectionInfo} />
      ),
    },
    !!shouldShowSlide("GROUP_SHOW") && {
      key: "GROUP_SHOW",
      content: (
        <CareerHighlightBigCardGroupShow type="GROUP_SHOW" highlightData={myCollectionInfo} />
      ),
    },
    !!shouldShowSlide("SOLO_SHOW") && {
      key: "SOLO_SHOW",
      content: <CareerHighlightBigCardSoloShow type="SOLO_SHOW" highlightData={myCollectionInfo} />,
    },
    !!shouldShowSlide("REVIEWED") && {
      key: "REVIEWED",
      content: <CareerHighlightBigCardReviewed type="REVIEWED" highlightData={myCollectionInfo} />,
    },
    {
      key: "promoCard",
      content: <CareerHighlightsPromotionalCard />,
    },
  ])

  const setSliderPage = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { currentPage } = sliderState
    const { x } = event.nativeEvent.contentOffset

    const currentSlide = Math.round(x / screenWidth)

    if (currentSlide !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: currentSlide,
      })
    }

    // TODO: mark the slide as seen here
    // the seen slide will be slides[currentCard].key
    // TODO: not to forget to mark the initial slide as seen as well
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
        <ScrollView
          horizontal
          scrollEventThrottle={10}
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: screenWidth * openedCardIndex, y: 0 }}
          onMomentumScrollEnd={(event: NativeSyntheticEvent<NativeScrollEvent>) =>
            setSliderPage(event)
          }
        >
          {slides.map(({ key, content }) => {
            return <Flex key={key}>{content}</Flex>
          })}
        </ScrollView>
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
