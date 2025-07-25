import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, Text, ToolTip, Touchable, useColor } from "@artsy/palette-mobile"
import { MedianAuctionPriceRail_me$data } from "__generated__/MedianAuctionPriceRail_me.graphql"
import { VisualCluesConstMap } from "app/store/config/visualClues"
import { setVisualClueAsSeen } from "app/utils/hooks/useVisualClue"
import { isNil } from "lodash"

export type MedianSalePriceArtwork = NonNullable<
  NonNullable<NonNullable<MedianAuctionPriceRail_me$data["priceInsightUpdates"]>["edges"]>[0]
>["node"]

interface Props {
  artworks: MedianSalePriceArtwork[]
  enableToolTip?: boolean
  onPress?: (medium?: string) => void
}

export const MedianAuctionPriceListItem: React.FC<Props> = ({
  artworks,
  enableToolTip = false,
  onPress,
}) => {
  const color = useColor()

  const firstItem = artworks[0]
  const restItems = artworks.slice(1)

  const artist = firstItem?.artist

  const firstMedianSalePriceDisplayText = firstItem?.marketPriceInsights?.medianSalePriceDisplayText

  return (
    <Flex pt={0.5} pb={2}>
      <Touchable
        accessibilityRole="button"
        testID="artistTouchable"
        disabled={!onPress}
        underlayColor={color("mono5")}
        onPress={() => onPress?.()}
      >
        <Flex mx={2} flexDirection="row" alignItems="center">
          <Flex
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="mono10"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            style={{ marginTop: 3 }}
          >
            {!!artist?.imageUrl ? (
              <Image width={40} height={40} src={artist?.imageUrl} />
            ) : (
              <NoArtIcon width={20} height={20} opacity={0.3} />
            )}
          </Flex>
          <Flex pl="15px">
            <Text variant="xs" ellipsizeMode="middle">
              {artist?.name}
            </Text>
            <Text variant="xs" ellipsizeMode="middle" color="mono60">
              {artist?.formattedNationalityAndBirthday}
            </Text>
          </Flex>
        </Flex>
        <Flex mx={2} pt={1} pb={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={1} pr="15px">
            <Text variant="xs">{firstItem?.mediumType?.name}</Text>
          </Flex>
          <Flex alignItems="flex-end">
            {!isNil(firstMedianSalePriceDisplayText) && enableToolTip ? (
              <ToolTip
                enabled
                initialToolTipText="Tap to interact with graph"
                position="TOP"
                tapToDismiss
                onPress={() => {
                  setVisualClueAsSeen(VisualCluesConstMap.MedianAuctionPriceListItemTooltip)
                }}
              >
                <Text variant="xs" weight="medium">
                  {firstMedianSalePriceDisplayText}
                </Text>
              </ToolTip>
            ) : (
              <Text variant="xs" weight="medium">
                {firstMedianSalePriceDisplayText}
              </Text>
            )}
          </Flex>
        </Flex>
      </Touchable>
      {restItems.map((artwork, index) => (
        <Touchable
          accessibilityRole="button"
          testID="categoryTouchable"
          key={artwork?.internalID}
          onPress={() => {
            if (artwork?.mediumType?.name) {
              onPress?.(artwork.mediumType.name)
            }
          }}
        >
          <Flex mx={2} pt={index === 0 ? 0 : 1} flexDirection="row" justifyContent="space-between">
            <Flex flex={1} pr="15px">
              <Text variant="xs">{artwork?.mediumType?.name}</Text>
            </Flex>
            <Flex alignItems="flex-end">
              <Text variant="xs" weight="medium">
                {artwork?.marketPriceInsights?.medianSalePriceDisplayText}
              </Text>
            </Flex>
          </Flex>
        </Touchable>
      ))}
    </Flex>
  )
}
