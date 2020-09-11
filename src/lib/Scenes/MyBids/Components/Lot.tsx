import { Lot_saleArtwork } from "__generated__/Lot_saleArtwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Box, color, Flex, Text } from "palette"
import React from "react"
import { TouchableHighlight, View } from "react-native"
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
      <TouchableHighlight
        underlayColor={color("white100")}
        activeOpacity={0.8}
        onPress={() => SwitchBoard.presentNavigationViewController(this, saleArtwork?.artwork?.href as string)}
      >
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
      </TouchableHighlight>
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
