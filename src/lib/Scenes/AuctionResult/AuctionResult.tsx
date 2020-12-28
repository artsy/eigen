import { AuctionResultQuery } from "__generated__/AuctionResultQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Flex, Spacer, Text } from "palette"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, ScrollView, ScrollViewProps } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

const useStickyScrollHeader = ({ header, showAtScrollOffset }: { header: JSX.Element; showAtScrollOffset: number }) => {
  const [isVisible, setIsVisible] = useState(false)
  const entrance = useRef(new Animated.Value(0)).current
  const headerElement = useMemo(
    () => (
      <Animated.View
        pointerEvents={isVisible ? undefined : "none"}
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        }}
      >
        {header}
      </Animated.View>
    ),
    [header, isVisible]
  )

  const onScroll = useCallback<NonNullable<ScrollViewProps["onScroll"]>>((e) => {
    setIsVisible(e.nativeEvent.contentOffset.y >= showAtScrollOffset)
  }, [])

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: isVisible ? 1 : 0,
      useNativeDriver: true,
      bounciness: -7,
      speed: 13,
    }).start()
  }, [isVisible])

  return {
    headerElement,
    scrollProps: {
      onScroll,
      scrollEventThreshold: 100,
    },
  }
}

const AuctionResult: React.FC = (props) => {
  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex backgroundColor="white">
        <FancyModalHeader>Title here</FancyModalHeader>
      </Flex>
    ),
    showAtScrollOffset: 200,
  })

  return (
    <>
      <ScrollView {...scrollProps}>
        <FancyModalHeader hideBottomDivider />
        <Box px={2}>
          <Box py={500}>
            <Text mt={10}>{JSON.stringify(props)}</Text>
          </Box>
        </Box>
      </ScrollView>
      {headerElement}
    </>
  )
}

export const AuctionResultQueryRenderer: React.FC<{
  auctionResultInternalID: string
  artistInternalID: string
}> = ({ auctionResultInternalID }) => {
  return (
    <QueryRenderer<AuctionResultQuery>
      environment={defaultEnvironment}
      query={graphql`
        query AuctionResultQuery($auctionResultInternalID: String!) {
          auctionResult(id: $auctionResultInternalID) {
            artistID
            boughtIn
            categoryText
            currency
            description
            dimensions {
              height
              width
            }
            dimensionText
            estimate {
              display
              high
              low
            }
            images {
              thumbnail {
                imageURL
              }
            }
            location
            mediumText
            organization
            priceRealized {
              centsUSD
              display
            }
            saleDate
            saleTitle
            title
          }
        }
      `}
      variables={{
        auctionResultInternalID,
        // artistInternalID,
      }}
      render={renderWithPlaceholder({
        Container: AuctionResult,
        renderPlaceholder: LoadingSkeleton,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <Spacer mb={6} />

      {/* Artist Name */}
      <PlaceholderBox width={300} height={30} />
      <Spacer mb={1} />
    </>
  )
}
