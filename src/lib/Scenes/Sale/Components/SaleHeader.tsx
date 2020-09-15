import { Sale_sale } from "__generated__/Sale_sale.graphql"
import { Flex, Text } from "palette"
import React from "react"
import { Animated, Dimensions, View } from "react-native"
import { CaretButton } from "../../../Components/Buttons/CaretButton"
import OpaqueImageView from "../../../Components/OpaqueImageView/OpaqueImageView"
import { saleTime } from "../helpers/saleTime"

const COVER_IMAGE_HEIGHT = 260

interface AnimatedValue {
  interpolate({}): {}
}

interface Props {
  sale: Sale_sale
  scrollAnim: AnimatedValue
}

export const SaleHeader: React.FC<Props> = (props) => {
  const saleTimeDetails = saleTime(props.sale)
  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: COVER_IMAGE_HEIGHT,
          width: "100%",
          opacity: props.scrollAnim.interpolate({
            inputRange: [0, COVER_IMAGE_HEIGHT],
            outputRange: [1, 0],
          }),
          transform: [
            {
              scale: props.scrollAnim.interpolate({
                inputRange: [-COVER_IMAGE_HEIGHT, 0, 1],
                outputRange: [2, 1, 1],
              }),
            },
            {
              translateY: props.scrollAnim.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [-0.5, 0, 0.5],
              }),
            },
          ],
        }}
      >
        {!!props.sale.coverImage?.url && (
          <OpaqueImageView
            imageURL={props.sale.coverImage.url}
            style={{
              width: Dimensions.get("window").width,
              height: COVER_IMAGE_HEIGHT,
            }}
          />
        )}
      </Animated.View>
      <View
        style={{
          backgroundColor: "white",
          marginTop: COVER_IMAGE_HEIGHT,
        }}
      >
        <Flex mx="2" my="2">
          <Text variant="largeTitle">{props.sale.name}</Text>
          <Flex my="1">
            <Text style={{ fontWeight: "bold" }} variant="text">
              {saleTimeDetails?.absolute}
            </Text>
            {!!saleTimeDetails?.relative && (
              <Text variant="text" color="black60">
                {saleTimeDetails?.relative}
              </Text>
            )}
          </Flex>
          <CaretButton text={"More info about this auction"} />
        </Flex>
      </View>
    </>
  )
}
