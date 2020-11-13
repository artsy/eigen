import { SaleHeader_sale } from "__generated__/SaleHeader_sale.graphql"
import { getCurrentEmissionState } from "lib/store/AppStore"
import { saleTime } from "lib/utils/saleTime"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import moment from "moment"
import { Flex, Text } from "palette"
import React from "react"
import { Animated, Dimensions, Image, TouchableOpacity, View } from "react-native"
import * as AddCalendarEvent from "react-native-add-calendar-event"
import { CreateOptions } from "react-native-add-calendar-event"
import { createFragmentContainer, graphql } from "react-relay"
import RemoveMarkDown from "remove-markdown"
import { CaretButton } from "../../../Components/Buttons/CaretButton"
import OpaqueImageView from "../../../Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "../../../navigation/navigate"

export const COVER_IMAGE_HEIGHT = 260

interface AnimatedValue {
  interpolate({}): {}
}

interface Props {
  sale: SaleHeader_sale
  scrollAnim: AnimatedValue
}

export const SaleHeader: React.FC<Props> = ({ sale, scrollAnim }) => {
  const saleTimeDetails = saleTime(sale)

  const saveCalendarEvent = async () => {
    try {
      // See https://github.com/vonovak/react-native-add-calendar-event#creating-an-event
      const eventConfig: CreateOptions = {
        title: sale.name!,
        startDate: moment(sale.startAt!).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        endDate: sale.endAt
          ? moment(sale.endAt).add(1, "hour").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          : moment(sale.startAt!).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        url: `${getCurrentEmissionState().webURL}${sale.href!}`,
        notes: RemoveMarkDown(sale.description || ""),
      }

      await AddCalendarEvent.presentEventCreatingDialog(eventConfig)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {!!sale.coverImage?.url && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: COVER_IMAGE_HEIGHT,
            width: "100%",
            opacity: scrollAnim.interpolate({
              inputRange: [0, COVER_IMAGE_HEIGHT],
              outputRange: [1, 0],
            }),
            transform: [
              {
                translateY: scrollAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 0, 0.5],
                }),
              },
            ],
          }}
        >
          <OpaqueImageView
            imageURL={sale.coverImage.url}
            style={{
              width: Dimensions.get("window").width,
              height: COVER_IMAGE_HEIGHT,
            }}
          >
            {!!sale.endAt && !!moment().isAfter(sale.endAt) && (
              <Flex
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  width: Dimensions.get("window").width,
                  height: COVER_IMAGE_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text variant="subtitle" fontWeight="500" color="white">
                  Auction closed
                </Text>
              </Flex>
            )}
          </OpaqueImageView>
        </Animated.View>
      )}
      <View
        style={{
          backgroundColor: "white",
          marginTop: !!sale.coverImage?.url ? COVER_IMAGE_HEIGHT : useScreenDimensions().safeAreaInsets.top + 40,
        }}
      >
        <Flex mx="2" mt="2">
          <Text variant="largeTitle" testID="saleName">
            {sale.name}
          </Text>
          <Flex my="1">
            {saleTimeDetails.absolute !== null && (
              <Text style={{ fontWeight: "bold" }} variant="text">
                {saleTimeDetails.absolute}
              </Text>
            )}
            <Flex flexDirection="row" alignItems="flex-end">
              {!!saleTimeDetails.relative && (
                <Text variant="text" color="black60">
                  {saleTimeDetails.relative}
                </Text>
              )}
              <TouchableOpacity onPress={saveCalendarEvent}>
                <Flex flexDirection="row" ml={1}>
                  <Image source={require("@images/calendar.png")} style={{ height: 17, width: 17 }} />
                  <Text variant="text" fontWeight="500" ml={0.5}>
                    Add to calendar
                  </Text>
                </Flex>
              </TouchableOpacity>
            </Flex>
          </Flex>
          <CaretButton
            text="More info about this auction"
            onPress={() => {
              navigate(`auction/${sale.slug}/info`)
            }}
          />
        </Flex>
      </View>
    </>
  )
}

export const SaleHeaderContainer = createFragmentContainer(SaleHeader, {
  sale: graphql`
    fragment SaleHeader_sale on Sale {
      name
      slug
      internalID
      liveStartAt
      endAt
      href
      description
      startAt
      timeZone
      coverImage {
        url
      }
    }
  `,
})
