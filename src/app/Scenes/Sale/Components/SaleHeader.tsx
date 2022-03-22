import { SaleHeader_sale } from "__generated__/SaleHeader_sale.graphql"
import { saleTime } from "app/utils/saleTime"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import moment from "moment"
import { Flex, Text } from "palette"
import { Animated, Dimensions, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { CaretButton } from "../../../Components/Buttons/CaretButton"
import OpaqueImageView from "../../../Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "../../../navigation/navigate"

export const COVER_IMAGE_HEIGHT = 260

interface Props {
  sale: SaleHeader_sale
  scrollAnim: Animated.Value
}

export const SaleHeader: React.FC<Props> = ({ sale, scrollAnim }) => {
  const saleTimeDetails = saleTime(sale)

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
          <View testID="sale-header-hero">
            <OpaqueImageView
              imageURL={sale.coverImage.url}
              style={{
                width: Dimensions.get("window").width,
                height: COVER_IMAGE_HEIGHT,
              }}
            />
            {!!sale.endAt && !!moment().isAfter(sale.endAt) && (
              <Flex
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text variant="md" fontWeight="500" color="white">
                  Auction closed
                </Text>
              </Flex>
            )}
          </View>
        </Animated.View>
      )}
      <View
        style={{
          backgroundColor: "white",
          marginTop: !!sale.coverImage?.url
            ? COVER_IMAGE_HEIGHT
            : useScreenDimensions().safeAreaInsets.top + 40,
        }}
      >
        <Flex mx="2" mt="2">
          <Text variant="lg" testID="saleName">
            {sale.name}
          </Text>
          <Flex my="1">
            {saleTimeDetails.absolute !== null && (
              <Text style={{ fontWeight: "bold" }} variant="sm">
                {saleTimeDetails.absolute}
              </Text>
            )}
            {!!saleTimeDetails.relative && (
              <Text variant="sm" color="black60">
                {saleTimeDetails.relative}
              </Text>
            )}
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
      liveStartAt
      endAt
      startAt
      timeZone
      coverImage {
        url
      }
    }
  `,
})
