import { ShareIcon, Flex, Text, Touchable, Image, useColor } from "@artsy/palette-mobile"
import { SaleHeader_sale$data } from "__generated__/SaleHeader_sale.graphql"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { navigate } from "app/system/navigation/navigate"
import { getAbsoluteTimeOfSale, saleTime, useRelativeTimeOfSale } from "app/utils/saleTime"
import moment from "moment"
import { Animated, Dimensions, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { createFragmentContainer, graphql } from "react-relay"

export const COVER_IMAGE_HEIGHT = 260
const SHARE_ICON_SIZE = 23

interface Props {
  sale: SaleHeader_sale$data
  scrollAnim: Animated.Value
}

export const SaleHeader: React.FC<Props> = ({ sale, scrollAnim }) => {
  const { showShareSheet } = useShareSheet()
  const color = useColor()
  const saInsets = useSafeAreaInsets()

  const saleTimeDetails = saleTime(sale)

  const absoluteTimeOfSale = getAbsoluteTimeOfSale(sale)

  const relativeTimeOfSale = useRelativeTimeOfSale(sale)

  const cascadingEndTimeFeatureEnabled = sale.cascadingEndTimeIntervalMinutes

  const shouldShowShareButton = !!sale?.href && !!sale?.name

  return (
    <Flex>
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
            <Image
              src={sale.coverImage.url}
              width={Dimensions.get("window").width}
              height={COVER_IMAGE_HEIGHT}
            />
            {!!sale.endAt && !!moment().isAfter(sale.endAt) && !cascadingEndTimeFeatureEnabled && (
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
                <Text variant="sm-display" fontWeight="500" color="mono0">
                  Auction closed
                </Text>
              </Flex>
            )}
          </View>
        </Animated.View>
      )}
      <View
        style={{
          backgroundColor: color("mono0"),
          marginTop: !!sale.coverImage?.url ? COVER_IMAGE_HEIGHT : saInsets.top + 40,
        }}
      >
        <Flex mx={2} mt={2}>
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Flex flex={1}>
              <Text variant="lg-display" testID="saleName">
                {sale.name}
              </Text>
            </Flex>
            <Flex flex={0.1}>
              {!!shouldShowShareButton && (
                <Touchable
                  onPress={() => {
                    !!shouldShowShareButton &&
                      showShareSheet({
                        type: "sale",
                        slug: sale.slug,
                        internalID: sale.internalID,
                        href: sale.href,
                        title: sale.name,
                        artists: [],
                      })
                  }}
                  style={{
                    width: 30,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  haptic="impactLight"
                >
                  <ShareIcon width={SHARE_ICON_SIZE} height={SHARE_ICON_SIZE} />
                </Touchable>
              )}
            </Flex>
          </Flex>
          {cascadingEndTimeFeatureEnabled ? (
            <>
              <Flex mb={1} mt={2}>
                {!!relativeTimeOfSale?.copy && (
                  <Text variant="sm" color={relativeTimeOfSale.color}>
                    {relativeTimeOfSale.copy}
                  </Text>
                )}
                {!!absoluteTimeOfSale && <Text variant="sm">{absoluteTimeOfSale}</Text>}
              </Flex>
              {!!sale.cascadingEndTimeIntervalMinutes && (
                <Text
                  variant="xs"
                  mb={2}
                >{`Lots close at ${sale.cascadingEndTimeIntervalMinutes}-minute intervals`}</Text>
              )}
            </>
          ) : (
            <Flex my={1}>
              {saleTimeDetails.absolute !== null && (
                <Text style={{ fontWeight: "bold" }} variant="sm">
                  {saleTimeDetails.absolute}
                </Text>
              )}
              {!!saleTimeDetails.relative && (
                <Text variant="sm" color="mono60">
                  {saleTimeDetails.relative}
                </Text>
              )}
            </Flex>
          )}
          <CaretButton
            text="More info about this auction"
            onPress={() => {
              navigate(`auction/${sale.slug}/info`)
            }}
          />
        </Flex>
      </View>
    </Flex>
  )
}

export const SaleHeaderContainer = createFragmentContainer(SaleHeader, {
  sale: graphql`
    fragment SaleHeader_sale on Sale {
      internalID
      href
      name
      slug
      liveStartAt
      endAt
      endedAt
      cascadingEndTimeIntervalMinutes
      startAt
      timeZone
      coverImage {
        url
      }
    }
  `,
})
