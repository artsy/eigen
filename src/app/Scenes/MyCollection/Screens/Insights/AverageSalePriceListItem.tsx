import { AverageSalePriceListItem_artwork$key } from "__generated__/AverageSalePriceListItem_artwork.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { QAInfoManualPanel, QAInfoRow } from "app/utils/QAInfo"
import { capitalize } from "lodash"
import { Flex, NoArtworkIcon, Spacer, Text, Touchable, useColor } from "palette"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface Props {
  artwork: AverageSalePriceListItem_artwork$key
  onPress: () => void
  showArtistName?: boolean
  withHorizontalPadding?: boolean
  first?: boolean
}

export const AverageSalePriceListItem: React.FC<Props> = ({
  onPress,
  showArtistName,
  withHorizontalPadding = true,
  first,
  ...restProps
}) => {
  const color = useColor()

  const artwork = useFragment(fragment, restProps.artwork)

  const QAInfo: React.FC = () => (
    <QAInfoManualPanel position="absolute" top={0} left={95}>
      <QAInfoRow name="id" value={artwork.internalID} />
    </QAInfoManualPanel>
  )

  const artistImageURL = artwork.artist?.image?.imageURL

  return (
    <Touchable underlayColor={color("black5")} onPress={onPress}>
      <Flex px={withHorizontalPadding ? 2 : 0} pb={1} pt={first ? 0 : 1} flexDirection="column">
        {/* Sale Artwork Thumbnail Image */}
        <Flex flexDirection="row">
          {artistImageURL ? (
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
              <OpaqueImageView width={40} height={40} imageURL={artistImageURL} />
            </Flex>
          ) : (
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
          )}
          {/* Sale Artwork Artist Name and Title */}
          <Flex pl={15}>
            {!!showArtistName && !!artwork.artist?.name && (
              <Text variant="xs" ellipsizeMode="middle" numberOfLines={2}>
                {artwork.artist?.name}
              </Text>
            )}
            <Text variant="xs" ellipsizeMode="middle" color="black60" numberOfLines={2} italic>
              {artwork.title}
            </Text>
          </Flex>
        </Flex>
        {/* Sale Artwork Medium */}
        {/* TODO: adjust according to the design and agreed logic when the backend is ready */}
        <Flex pt={2} flexDirection="row" justifyContent="space-between">
          {!!artwork.medium && <Text variant="xs">{capitalize(artwork.medium)}</Text>}
          {/* Sale Artwork Price Estimation */}
          <Flex alignItems="flex-end" pl={15}>
            <Flex alignItems="flex-end">
              <Text variant="xs" fontWeight="500" testID="price">
                {artwork.marketPriceInsights?.demandRank}
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

const fragment = graphql`
  fragment AverageSalePriceListItem_artwork on Artwork {
    internalID
    medium
    title
    artist {
      name
      image {
        imageURL
      }
    }
    marketPriceInsights {
      demandRank
    }
  }
`
