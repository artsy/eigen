import { AuctionResultQuery, AuctionResultQueryResponse } from "__generated__/AuctionResultQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ratioColor } from "lib/Components/Lists/AuctionResult"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Flex, Separator, Spacer, Text } from "palette"
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

interface Props {
  artist: AuctionResultQueryResponse["artist"]
  auctionResult: AuctionResultQueryResponse["auctionResult"]
}

const AuctionResult: React.FC<Props> = ({ artist, auctionResult }) => {
  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex backgroundColor="white">
        <FancyModalHeader>
          {auctionResult?.title}, {auctionResult?.dateText}
        </FancyModalHeader>
      </Flex>
    ),
    showAtScrollOffset: 100,
  })

  const getRatio = useCallback(() => {
    if (!auctionResult?.priceRealized?.cents || !auctionResult.estimate?.low) {
      return null
    }
    return auctionResult.priceRealized.cents / auctionResult.estimate.low
  }, [auctionResult?.priceRealized, auctionResult?.estimate])

  const getDifference = useCallback(() => {
    if (!auctionResult?.priceRealized?.cents || !auctionResult.estimate?.low) {
      return null
    }
    return (auctionResult.priceRealized.cents - auctionResult.estimate.low) / 100
  }, [auctionResult?.priceRealized, auctionResult?.estimate])

  const ratio = getRatio()
  const difference = getDifference()

  const stats = []
  const makeRow = (label: string, value: string, fullWidth?: boolean) => (
    <Flex key={label} mb={2}>
      <Separator mb={2} />
      {fullWidth ? (
        <Flex>
          <Text color="black60" mb={2}>
            {label}
          </Text>
          <Text>{value}</Text>
        </Flex>
      ) : (
        <Flex flexDirection="row" justifyContent="space-between">
          <Text color="black60">{label}</Text>
          <Flex maxWidth="80%">
            <Text pl={2} textAlign="right">
              {value}
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
  if (auctionResult?.estimate?.display) {
    const { currency, estimate } = auctionResult
    stats.push(makeRow("Estimate range", `${estimate.display} ${currency}`))
  }
  if (auctionResult?.mediumText) {
    stats.push(makeRow("Medium", auctionResult.mediumText))
  }
  if (auctionResult?.dateText) {
    stats.push(makeRow("Year created", auctionResult.dateText))
  }
  if (auctionResult?.saleDate) {
    stats.push(makeRow("Sale date", auctionResult.saleDate))
  }
  if (auctionResult?.organization) {
    stats.push(makeRow("Auction house", auctionResult.organization))
  }
  if (auctionResult?.saleTitle) {
    stats.push(makeRow("Sale name", auctionResult.saleTitle))
  }
  if (auctionResult?.location) {
    stats.push(makeRow("Sale location", auctionResult.location))
  }
  if (auctionResult?.description) {
    stats.push(makeRow("Description", auctionResult.description, true))
  }

  return (
    <>
      <ScrollView {...scrollProps}>
        <FancyModalHeader hideBottomDivider />
        <Box px={2} pb={1}>
          <Flex mt={1} mb={4} style={{ flexDirection: "row" }}>
            {!!auctionResult?.images?.thumbnail?.url ? (
              <OpaqueImageView width={60} height={80} imageURL={auctionResult?.images?.thumbnail?.url} />
            ) : (
              <Box style={{ height: 80, width: 60 }} backgroundColor="black10" />
            )}
            <Flex justifyContent="center" ml={2}>
              <Text variant="mediumText">{artist?.name}</Text>
              <Text variant="subtitle">
                {auctionResult?.title}, {auctionResult?.dateText}
              </Text>
            </Flex>
          </Flex>
          <Text variant="subtitle" mb={1}>
            Realized price
          </Text>
          <Text variant="largeTitle">
            {auctionResult?.priceRealized?.display} {auctionResult?.currency}
          </Text>
          {!!ratio && (
            <Flex flexDirection="row">
              <Flex borderRadius={2} overflow="hidden">
                <Flex
                  position="absolute"
                  width="100%"
                  height="100%"
                  backgroundColor={ratioColor(ratio)}
                  opacity={0.1}
                />
                <Text variant="mediumText" color={ratioColor(ratio)} px="5px">
                  {ratio.toFixed(2)}x{" "}
                  {!!difference &&
                    `(${difference > 0 ? "+" : ""}${new Intl.NumberFormat().format(difference)} ${
                      auctionResult?.currency
                    })`}
                </Text>
              </Flex>
              <Text variant="text" color="black60">
                {" "}
                low estimate
              </Text>
            </Flex>
          )}
          <Text variant="subtitle" mt={4} mb={1}>
            Stats
          </Text>
          {stats}
        </Box>
      </ScrollView>
      {headerElement}
    </>
  )
}

export const AuctionResultQueryRenderer: React.FC<{
  auctionResultInternalID: string
  artistID: string
}> = ({ auctionResultInternalID, artistID }) => {
  return (
    <QueryRenderer<AuctionResultQuery>
      environment={defaultEnvironment}
      query={graphql`
        query AuctionResultQuery($auctionResultInternalID: String!, $artistID: String!) {
          auctionResult(id: $auctionResultInternalID) {
            artistID
            boughtIn
            categoryText
            currency
            dateText
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
                url(version: "square140")
                height
                width
                aspectRatio
              }
            }
            location
            mediumText
            organization
            priceRealized {
              cents
              centsUSD
              display
            }
            saleDate
            saleTitle
            title
          }
          artist(id: $artistID) {
            name
          }
        }
      `}
      variables={{
        auctionResultInternalID,
        artistID,
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
