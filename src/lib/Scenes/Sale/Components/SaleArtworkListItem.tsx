import { SaleArtworkListItem_artwork } from "__generated__/SaleArtworkListItem_artwork.graphql"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Flex, Sans } from "palette"
import { Touchable } from "palette"
import React, { useRef } from "react"
import { StyleSheet } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: SaleArtworkListItem_artwork
}

const CONTAINER_HEIGHT = 100

export const SaleArtworkListItem: React.FC<Props> = ({ artwork }) => {
  const itemRef = useRef<any>()

  const onPress = () => {
    SwitchBoard.presentNavigationViewController(
      itemRef.current!,
      // @ts-ignore STRICTNESS_MIGRATION
      artwork.href
    )
  }
  const saleInfo = saleMessageOrBidInfo({ artwork })

  return (
    <Touchable onPress={onPress}>
      <Flex flexDirection="row" alignItems="center" height={CONTAINER_HEIGHT} ref={itemRef}>
        {!!artwork.image && (
          <OpaqueImageView
            aspectRatio={artwork.image?.aspectRatio ?? 1}
            imageURL={artwork.image?.url}
            style={styles.artworkImage}
          />
        )}

        <Flex ml={2} height={100} flex={1}>
          {!!artwork.saleArtwork?.lotLabel && (
            <Sans size="3t" color="black60" numberOfLines={1}>
              Lot {artwork.saleArtwork.lotLabel}
            </Sans>
          )}
          {!!artwork.artistNames && (
            <Sans size="3t" weight="medium" numberOfLines={1}>
              {artwork.artistNames}
            </Sans>
          )}
          {!!artwork.title && (
            <Sans size="3t" color="black60" numberOfLines={2}>
              {artwork.title}
              {!!artwork.date && `, ${artwork.date}`}
            </Sans>
          )}
          {!!saleInfo && (
            <Sans color="black60" size="3t" numberOfLines={1}>
              {saleInfo}
            </Sans>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}

const styles = StyleSheet.create({
  artworkImage: {
    justifyContent: "flex-end",
    paddingHorizontal: 5,
    paddingBottom: 5,
    height: CONTAINER_HEIGHT,
    width: CONTAINER_HEIGHT,
  },
})

export const SaleArtworkListItemContainer = createFragmentContainer(SaleArtworkListItem, {
  artwork: graphql`
    fragment SaleArtworkListItem_artwork on Artwork {
      title
      date
      saleMessage
      slug
      internalID
      artistNames
      href
      sale {
        isAuction
        isClosed
        displayTimelyAt
        endAt
      }
      saleArtwork {
        counts {
          bidderPositions
        }
        currentBid {
          display
        }
        lotLabel
      }
      image {
        url(version: "large")
        aspectRatio
      }
    }
  `,
})
