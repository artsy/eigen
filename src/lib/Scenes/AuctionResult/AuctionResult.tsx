import { AuctionResultQuery, AuctionResultQueryResponse } from "__generated__/AuctionResultQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ratioColor } from "lib/Components/Lists/AuctionResult"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import moment from "moment"
import { Box, Flex, Separator, Spacer, Text } from "palette"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { Animated, Image, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

const useStickyScrollHeader = ({ header }: { header: JSX.Element; showAtScrollOffset: number }) => {
  const scrollAnim = new Animated.Value(0)
  const fadeInStart = 90
  const fadeInEnd = 100
  const snapAnim = new Animated.Value(0)
  const scrollEndTimer = useRef()
  const translateYNumber = useRef(0)
  scrollAnim.addListener(({ value }) => {
    console.log(value)
    translateYNumber.current = value
  })
  const headerElement = useMemo(
    () => (
      <Animated.View
        pointerEvents={
          translateYNumber?.current !== undefined && translateYNumber.current < fadeInStart ? undefined : "none"
        }
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          opacity: Animated.add(scrollAnim, snapAnim).interpolate({
            inputRange: [fadeInStart, fadeInEnd],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
        }}
      >
        {header}
      </Animated.View>
    ),
    [header, scrollAnim]
  )

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollAnim },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  )

  const handleSnap = (offsetY: number) => {
    // const offsetY = nativeEvent.contentOffset.y
    if (offsetY > fadeInStart && offsetY < fadeInEnd) {
      const toValue =
        offsetY - fadeInStart < (fadeInEnd - fadeInStart) / 2 ? fadeInStart - offsetY : fadeInEnd - offsetY
      Animated.timing(snapAnim, {
        toValue,
        duration: 100,
        useNativeDriver: true,
      }).start()
    }
  }

  // nasty workaround to figure out scrollEnd
  // https://medium.com/appandflow/react-native-collapsible-navbar-e51a049b560a
  const onScrollEndDrag = (evt: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = evt.nativeEvent.contentOffset.y
    scrollEndTimer.current = setTimeout(() => {
      handleSnap(offsetY)
    }, 250)
  }

  return {
    headerElement,
    scrollProps: {
      onMomentumScrollBegin: (e) => {
        if (scrollEndTimer) {
          clearTimeout(scrollEndTimer.current)
        }
      },
      onMomentumScrollEnd: (evt: NativeSyntheticEvent<NativeScrollEvent>) =>
        handleSnap(evt.nativeEvent.contentOffset.y),
      onScroll,
      onScrollEndDrag,
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
          <Text variant="title">
            {auctionResult?.title}, {auctionResult?.dateText}
          </Text>
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
    <Flex key={label} mb={1}>
      <Flex style={{ opacity: 0.5 }}>
        <Separator mb={1} />
      </Flex>
      {fullWidth ? (
        <Flex>
          <Text color="black60" mb={1}>
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
  if (auctionResult?.dimensionText) {
    stats.push(makeRow("Dimensions", auctionResult.dimensionText))
  }
  if (auctionResult?.dateText) {
    stats.push(makeRow("Year created", auctionResult.dateText))
  }
  if (auctionResult?.saleDate) {
    stats.push(makeRow("Sale date", moment(auctionResult.saleDate).format("MMM D, YYYY")))
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

  const hasSalePrice = !!auctionResult?.priceRealized?.display && !!auctionResult.currency
  const now = moment()
  const isFromPastMonth = auctionResult?.saleDate
    ? moment(auctionResult.saleDate).isAfter(now.subtract(1, "month"))
    : false
  const salePriceMessage = isFromPastMonth
    ? "Awaiting results"
    : auctionResult?.boughtIn === true
    ? "Bought in"
    : "Not available"

  return (
    <>
      <Animated.ScrollView {...scrollProps}>
        <FancyModalHeader hideBottomDivider />
        <Box px={2} pb={4}>
          <Flex mt={1} mb={4} style={{ flexDirection: "row" }}>
            {!!auctionResult?.images?.thumbnail?.url ? (
              <OpaqueImageView width={60} height={80} imageURL={auctionResult?.images?.thumbnail?.url} />
            ) : (
              <Box style={{ height: 80, width: 60 }} backgroundColor="black10" />
            )}
            <Flex justifyContent="center" ml={2}>
              <Text variant="mediumText">{artist?.name}</Text>
              <Text variant="title">
                {auctionResult?.title}, {auctionResult?.dateText}
              </Text>
            </Flex>
          </Flex>
          {!!hasSalePrice && (
            <Flex flexDirection="row">
              <Text variant="title" mb={1} mr={1}>
                Realized price
              </Text>
              <TouchableOpacity style={{ top: 1 }} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Image source={require("@images/info.png")} />
              </TouchableOpacity>
            </Flex>
          )}
          <Text variant="largeTitle">
            {hasSalePrice ? `${auctionResult?.priceRealized?.display} ${auctionResult?.currency}` : salePriceMessage}
          </Text>
          {!!ratio && (
            <Flex flexDirection="row" mt={1}>
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
              <Text variant="text" color="black60" ml={1}>
                low estimate
              </Text>
            </Flex>
          )}
          <Text variant="title" mt={4} mb={1}>
            Stats
          </Text>
          {stats}
        </Box>
      </Animated.ScrollView>
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
