import { CareerHighlightsCardsQuery } from "__generated__/CareerHighlightsCardsQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/navigation/navigate"
import { Flex, useColor, useSpace } from "palette"
import { useState } from "react"
import { Animated, ScrollView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { CareerHighlightsBiennialCard } from "./CareerHighlightsBiennialCard"
import { CareerHighlightsCollectedCard } from "./CareerHighlightsCollectedCard"
import { CareerHighlightsPromotionalCard } from "./CareerHighlightsPromotionalCard"

export const CareerHighlightsCards: React.FC = () => {
  const { width } = useScreenDimensions()
  const data = useLazyLoadQuery<CareerHighlightsCardsQuery>(CareerHighlightsCardsScreenQuery, {})
  const [sliderState, setSliderState] = useState({ currentPage: 0 })

  const myCollectionInfo = data.me?.myCollectionInfo

  if (!myCollectionInfo) {
    return null
  }

  const setSliderPage = (event: any) => {
    const { currentPage } = sliderState
    const { x } = event.nativeEvent.contentOffset
    const indexOfNextScreen = Math.floor(x / width)
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      })
    }
  }

  const { currentPage: pageIndex } = sliderState
  const { width: screenWidth } = useScreenDimensions()
  const color = useColor()
  const space = useSpace()
  // 18 is the close button size, 20 is screen margin and 10 is the spase between the
  // close button and the bar
  const barWidth = (screenWidth - 18 - 20 - 20 - 10) / 3
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
          {Array.from(Array(3).keys()).map((key, index) => (
            <Animated.View
              accessibilityLabel="Image Pagination Scroll Bar"
              key={key}
              style={{
                height: 2,
                width: barWidth - space(1),
                marginRight: space(1),
                borderRadius: 2,
                backgroundColor: color("black100"),
                opacity: pageIndex === index ? 1 : 0.2,
              }}
            />
          ))}
        </Flex>
      </FancyModalHeader>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        decelerationRate={0}
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={(event: any) => {
          setSliderPage(event)
        }}
      >
        <CareerHighlightsCollectedCard myCollectionInfo={myCollectionInfo} />
        <CareerHighlightsBiennialCard myCollectionInfo={myCollectionInfo} />
        <CareerHighlightsPromotionalCard />
      </ScrollView>
    </>
  )
}

export const CareerHighlightsCardsScreenQuery = graphql`
  query CareerHighlightsCardsQuery {
    me {
      myCollectionInfo {
        ...CareerHighlightsCollectedCard_myCollectionInfo
        ...CareerHighlightsBiennialCard_myCollectionInfo
      }
    }
  }
`
