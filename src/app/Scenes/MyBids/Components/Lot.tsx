import { Flex, Box, Text } from "@artsy/palette-mobile"
import { Lot_saleArtwork$data } from "__generated__/Lot_saleArtwork.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  saleArtwork: Lot_saleArtwork$data
  /** Something to display below the artist name - defaults to lot number */
  subtitle?: string
  /** An optional 20px^2 badge to display in the upper-left corner of the artwork thumbnail */
  ArtworkBadge?: React.ComponentType
  isSmallScreen?: boolean
}

class Lot extends React.Component<Props> {
  render() {
    const { saleArtwork, subtitle, children, ArtworkBadge, isSmallScreen } = this.props

    return (
      <Flex flexDirection="row" width="50%" paddingRight={2}>
        <Flex mr={isSmallScreen ? 0.5 : 1}>
          <Flex width={50} height={50} borderRadius={2} overflow="hidden">
            <OpaqueImageView width={50} height={50} imageURL={saleArtwork?.artwork?.image?.url} />
          </Flex>
          {!!ArtworkBadge && (
            <Box position="absolute" top={-2} left={-5}>
              <ArtworkBadge />
            </Box>
          )}
        </Flex>
        <Flex alignItems="baseline">
          <Text variant="xs" numberOfLines={2}>
            {saleArtwork?.artwork?.artistNames}
          </Text>
          <Text variant="xs" color="black60" numberOfLines={1}>
            {subtitle ? subtitle : !!saleArtwork.lotLabel && `Lot ${saleArtwork.lotLabel}`}
          </Text>
        </Flex>
        <Flex width="50%" alignItems="flex-end">
          {children}
        </Flex>
      </Flex>
    )
  }
}

export const LotFragmentContainer = createFragmentContainer(Lot, {
  saleArtwork: graphql`
    fragment Lot_saleArtwork on SaleArtwork {
      lotLabel
      artwork {
        artistNames
        image {
          url(version: "medium")
        }
      }
    }
  `,
})
