import { Lot_saleArtwork } from "__generated__/Lot_saleArtwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Box, Flex, Text, Touchable } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  saleArtwork: Lot_saleArtwork
  /** Something to display below the artist name - defaults to lot number */
  subtitle?: string
  /** An optional 20px^2 badge to display in the upper-left corner of the artwork thumbnail */
  ArtworkBadge?: React.ComponentType
}

class Lot extends React.Component<Props> {
  render() {
    const { saleArtwork, subtitle, children, ArtworkBadge } = this.props

    return (
      <Touchable onPress={() => navigate(saleArtwork?.artwork?.href as string)}>
        <View>
          <Flex my="1" flexDirection="row">
            <Flex mr="1">
              <OpaqueImageView width={60} height={60} imageURL={saleArtwork?.artwork?.image?.url} />
              {!!ArtworkBadge && (
                <Box position="absolute" top={-2} left={-5}>
                  {<ArtworkBadge />}
                </Box>
              )}
            </Flex>

            <Flex flexGrow={1} flexShrink={1}>
              <Text variant="caption">{saleArtwork?.artwork?.artistNames}</Text>
              <Text variant="caption" color="black60">
                {subtitle ? subtitle : !!saleArtwork.lotLabel && `Lot ${saleArtwork.lotLabel}`}
              </Text>
            </Flex>

            <Flex flexGrow={1} alignItems="flex-end">
              {children}
            </Flex>
          </Flex>
        </View>
      </Touchable>
    )
  }
}

export const LotFragmentContainer = createFragmentContainer(Lot, {
  saleArtwork: graphql`
    fragment Lot_saleArtwork on SaleArtwork {
      lotLabel
      artwork {
        artistNames
        href
        image {
          url(version: "medium")
        }
      }
    }
  `,
})
