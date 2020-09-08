import { Sale_sale } from "__generated__/Sale_sale.graphql"
import { Flex, Text } from "palette"
import React, { Fragment } from "react"
import { Animated, Dimensions, Image, View } from "react-native"
import { CaretButton } from "../../../Components/Buttons/CaretButton"
import { saleTime } from "../helpers/saleTime"

const COVER_IMAGE_HEIGHT = 260

interface Props {
  sale: Sale_sale
  scrollAnim: any
}

export const SaleHeader: React.FC<Props> = props => {
  const saleTimeDetails = saleTime(props.sale)
  return (
    <Fragment>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: COVER_IMAGE_HEIGHT,
          width: Dimensions.get("window").width,
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
          <Image
            resizeMode="cover"
            source={{ uri: props.sale.coverImage.url }}
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
    </Fragment>
  )
}
