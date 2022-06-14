import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { QAInfoManualPanel, QAInfoRow } from "app/utils/QAInfo"
import { capitalize } from "lodash"
import { Flex, NoArtworkIcon, Spacer, Text, Touchable, useColor } from "palette"
import React from "react"

interface Props {
  estimatedArtwork: any
  onPress: () => void
  showArtistName?: boolean
  withHorizontalPadding?: boolean
  first?: boolean
}

export const AverageSalePriceListItem: React.FC<Props> = ({
  estimatedArtwork,
  onPress,
  showArtistName,
  withHorizontalPadding = true,
  first,
}) => {
  const color = useColor()

  const QAInfo: React.FC = () => (
    <QAInfoManualPanel position="absolute" top={0} left={95}>
      <QAInfoRow name="id" value={estimatedArtwork.internalID} />
    </QAInfoManualPanel>
  )

  return (
    <Touchable underlayColor={color("black5")} onPress={onPress}>
      <Flex px={withHorizontalPadding ? 2 : 0} pb={1} pt={first ? 0 : 1} flexDirection="column">
        {/* Sale Artwork Thumbnail Image */}
        <Flex flexDirection="row">
          {!estimatedArtwork.artist?.imageUrl ? (
            <Flex
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor="black10"
              alignItems="center"
              justifyContent="center"
            >
              <NoArtworkIcon width={28} height={28} opacity={0.3} />
            </Flex>
          ) : (
            <Flex
              width={40}
              height={40}
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              // To align the image with the text we have to add top margin to compensate the line height.
              style={{ marginTop: 3 }}
            >
              <OpaqueImageView width={40} height={40} imageURL={estimatedArtwork.artist.imageUrl} />
            </Flex>
          )}
          {/* Sale Artwork Artist Name, Birthday and Nationality */}
          <Flex justifyContent="center" pl={15}>
            {!!showArtistName && !!estimatedArtwork.artist?.name && (
              <Text variant="xs" ellipsizeMode="middle" numberOfLines={2}>
                {estimatedArtwork.artist?.name}
              </Text>
            )}
            {!!estimatedArtwork.artist?.formattedNationalityAndBirthday && (
              <Text variant="xs" ellipsizeMode="middle" color="black60">
                {estimatedArtwork.artist?.formattedNationalityAndBirthday}
              </Text>
            )}
          </Flex>
        </Flex>
        {/* Sale Artwork Medium */}
        {/* TODO: adjust according to the design and agreed logic when the backend is ready */}
        <Flex pt={2} flexDirection="row" justifyContent="space-between">
          {!!estimatedArtwork.medium && (
            <Text variant="xs">{capitalize(estimatedArtwork.medium)}</Text>
          )}
          {/* Sale Artwork Price Estimation */}
          <Flex alignItems="flex-end" pl={15}>
            <Flex alignItems="flex-end">
              <Text variant="xs" fontWeight="500" testID="price">
                {estimatedArtwork.priceRealized?.displayUSD}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <QAInfo />
    </Touchable>
  )
}

export const AverageSalePriceListSeparator = () => <Spacer px={2} />
