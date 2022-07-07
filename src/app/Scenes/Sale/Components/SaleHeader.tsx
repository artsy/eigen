import Clipboard from "@react-native-community/clipboard"
import { SaleHeader_sale$data } from "__generated__/SaleHeader_sale.graphql"
import { CustomShareSheet, CustomShareSheetItem } from "app/Components/CustomShareSheet"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { getAbsoluteTimeOfSale, saleTime, useRelativeTimeOfSale } from "app/utils/saleTime"
import moment from "moment"
import { Flex, LinkIcon, MoreIcon, ShareIcon, Text, Touchable } from "palette"
import React, { useState } from "react"
import { Animated, Dimensions, View } from "react-native"
import RNShare, { ShareOptions } from "react-native-share"
import { createFragmentContainer, graphql } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { CaretButton } from "../../../Components/Buttons/CaretButton"
import OpaqueImageView from "../../../Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "../../../navigation/navigate"
import { useFeatureFlag } from "../../../store/GlobalStore"

export const COVER_IMAGE_HEIGHT = 260
const SHARE_ICON_SIZE = 23

interface Props {
  sale: SaleHeader_sale$data
  scrollAnim: Animated.Value
}

export const SaleHeader: React.FC<Props> = ({ sale, scrollAnim }) => {
  const [shareSheetVisible, setShareSheetVisible] = useState(false)

  const enableAuctionShare = useFeatureFlag("AREnableAuctionShareButton")

  const toast = useToast()

  const saleTimeDetails = saleTime(sale)

  const absoluteTimeOfSale = getAbsoluteTimeOfSale(sale)

  const relativeTimeOfSale = useRelativeTimeOfSale(sale)

  const cascadingEndTimeFeatureEnabled =
    useFeatureFlag("AREnableCascadingEndTimerSalePageDetails") &&
    sale.cascadingEndTimeIntervalMinutes

  const handleCopyLinkPress = () => {
    const clipboardLink = getShareURL(sale.href!)

    setShareSheetVisible(false)
    Clipboard.setString(clipboardLink)
    toast.show("Copied to Clipboard", "middle", { Icon: ShareIcon })
  }

  const handleMorePress = async () => {
    try {
      const url = getShareURL(sale.href!)
      const message = sale.name + " on Artsy"
      const shareOptions: ShareOptions = {
        title: message,
        message: message + "\n" + url,
      }

      await RNShare.open(shareOptions)
    } catch (error) {
      console.log(error)
    } finally {
      setShareSheetVisible(false)
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
          <View testID="sale-header-hero">
            <OpaqueImageView
              imageURL={sale.coverImage.url}
              style={{
                width: Dimensions.get("window").width,
                height: COVER_IMAGE_HEIGHT,
              }}
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
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Flex flex={1}>
              <Text variant="lg" testID="saleName">
                {sale.name}
              </Text>
            </Flex>
            {!!enableAuctionShare && (
              <Flex flex={0.1}>
                <Touchable
                  onPress={() => {
                    setShareSheetVisible(true)
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
              </Flex>
            )}
          </Flex>
          {cascadingEndTimeFeatureEnabled ? (
            <>
              <Flex mb="1" mt="2">
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
          )}
          <CaretButton
            text="More info about this auction"
            onPress={() => {
              navigate(`auction/${sale.slug}/info`)
            }}
          />
        </Flex>
      </View>

      <CustomShareSheet visible={shareSheetVisible} setVisible={setShareSheetVisible}>
        <CustomShareSheetItem title="More" Icon={<MoreIcon />} onPress={handleMorePress} />
        <CustomShareSheetItem title="Copy link" Icon={<LinkIcon />} onPress={handleCopyLinkPress} />
      </CustomShareSheet>
    </>
  )
}

export const SaleHeaderContainer = createFragmentContainer(SaleHeader, {
  sale: graphql`
    fragment SaleHeader_sale on Sale {
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
