import { ActionType, OwnerType } from "@artsy/cohesion"
import { Lot_saleArtwork } from "__generated__/Lot_saleArtwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Box, Flex, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import track from "react-tracking"

interface Props {
  saleArtwork: Lot_saleArtwork
  /** Something to display below the artist name - defaults to lot number */
  subtitle?: string
  /** An optional 20px^2 badge to display in the upper-left corner of the artwork thumbnail */
  ArtworkBadge?: React.ComponentType
  isSmallScreen?: boolean
}

class Lot extends React.Component<Props> {
  handleTap() {
    track({
      action: ActionType.tappedArtworkGroup,
      // context_module: ContextModule [inboxActiveBids]
      context_screen_owner_type: OwnerType.inboxBids,
      destination_screen_owner_type: OwnerType.artwork,
      destination_screen_owner_id: this.props?.saleArtwork?.artwork?.internalID,
      destination_screen_owner_slug: this.props?.saleArtwork?.artwork?.slug,
      type: "thumbnail",
    })
    navigate(this.props?.saleArtwork?.artwork?.href!)
  }

  render() {
    const { saleArtwork, subtitle, children, ArtworkBadge, isSmallScreen } = this.props

    return (
      <Touchable onPress={() => this.handleTap()} style={{ marginHorizontal: 0, width: "100%" }}>
        <Flex flexDirection="row">
          <Flex width="50%">
            <Flex flexDirection="row">
              <Flex mr={isSmallScreen! ? 0.5 : 1}>
                <OpaqueImageView width={60} height={60} imageURL={saleArtwork?.artwork?.image?.url} />
                {!!ArtworkBadge && (
                  <Box position="absolute" top={-2} left={-5}>
                    {<ArtworkBadge />}
                  </Box>
                )}
              </Flex>

              <Flex alignItems="baseline" width="50%">
                <Text variant="caption" numberOfLines={2}>
                  {saleArtwork?.artwork?.artistNames}
                </Text>
                <Text variant="caption" color="black60" numberOfLines={1}>
                  {subtitle ? subtitle : !!saleArtwork.lotLabel && `Lot ${saleArtwork.lotLabel}`}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex width="50%" alignItems="flex-end">
            {children}
          </Flex>
        </Flex>
      </Touchable>
    )
  }
}

export const LotFragmentContainer = createFragmentContainer(Lot, {
  saleArtwork: graphql`
    fragment Lot_saleArtwork on SaleArtwork {
      lotLabel
      artwork {
        internalID
        artistNames
        href
        image {
          url(version: "medium")
        }
        slug
      }
    }
  `,
})
