import { SaleHeader_sale } from "__generated__/SaleHeader_sale.graphql"
import { getCurrentEmissionState } from "lib/store/AppStore"
import { saleTime } from "lib/utils/saleTime"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import moment from "moment"
import { Flex, Text } from "palette"
import React, { useRef, useState } from "react"
import { Animated, Dimensions, Easing, Image, Modal, TouchableOpacity, View } from "react-native"
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
  const animatedValue = useRef(new Animated.Value(0))
  const [isEventSavedModalVisible, setIsEventSavedModalVisible] = useState(false)

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

      const event = await AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      // The user saved the event successfully
      if (event.action === "SAVED") {
        setIsEventSavedModalVisible(true)
        const shakeSequence = [
          // start rotation in one direction (only half the time is needed)
          Animated.timing(animatedValue.current, {
            toValue: 1.0,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // rotate in other direction, to minimum value (= twice the duration of above)
          Animated.timing(animatedValue.current, {
            toValue: -1.0,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // return to begin position
          Animated.timing(animatedValue.current, {
            toValue: 0.0,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]
        Animated.sequence([...shakeSequence, ...shakeSequence]).start()
        setTimeout(() => {
          setIsEventSavedModalVisible(false)
        }, 2000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Modal
        visible={isEventSavedModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEventSavedModalVisible(false)}
      >
        <Flex
          mx={1}
          p={2}
          backgroundColor="white"
          mt={useScreenDimensions().safeAreaInsets.top}
          borderRadius={3}
          flexDirection="row"
          alignItems="center"
        >
          <Animated.Image
            source={require("@images/bell.png")}
            resizeMode="contain"
            style={{
              height: 20,
              width: 20,
              transform: [
                {
                  rotate: animatedValue.current.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ["-0.5rad", "0.5rad"],
                  }),
                },
              ],
            }}
          />
          <Text variant="mediumText" ml={1}>
            Event saved successfully
          </Text>
        </Flex>
      </Modal>
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
