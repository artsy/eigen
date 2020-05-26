import { Box, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { RecentlySold_artists } from "__generated__/RecentlySold_artists.graphql"
import { ArtworkTileRailCard, tappedArtworkGroupThumbnail } from "lib/Components/ArtworkTileRail"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface RecentlySoldProps {
  isLoading?: boolean
  artists: RecentlySold_artists
}

export const RecentlySold: React.FC<RecentlySoldProps> = ({ artists, isLoading }) => {
  if (isLoading) {
    return <RecentlySoldPlaceholder />
  }

  const navRef = useRef<any>()
  const tracking = useTracking()

  return (
    <Box px={2} ref={navRef}>
      <Box>
        <Sans size="4" mb={2}>
          Recently sold on Artsy
        </Sans>

        <Flex flexDirection="row">
          <Join separator={<Spacer mr={0.5} />}>
            <FlatList
              horizontal
              ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={5}
              windowSize={3}
              data={artists}
              renderItem={({ item }) => {
                const artwork = item.targetSupply?.microfunnel?.artworksConnection?.edges?.[0]
                const saleMessage = artwork?.node?.realizedPrice
                  ? `Sold for ${artwork?.node?.realizedPrice}`
                  : undefined

                return (
                  <ArtworkTileRailCard
                    imageURL={artwork?.node?.image?.imageURL}
                    artistNames={artwork?.node?.artistNames}
                    saleMessage={saleMessage}
                    key={artwork?.node?.internalID}
                    onPress={() => {
                      tracking.trackEvent(
                        tappedArtworkGroupThumbnail(
                          Schema.ContextModules.ArtworkRecentlySoldGrid,
                          artwork!.node!.internalID,
                          artwork!.node!.slug
                        )
                      )
                      SwitchBoard.presentNavigationViewController(navRef.current!, artwork?.node?.href!)
                    }}
                  />
                )
              }}
              keyExtractor={item => item?.internalID}
            />
          </Join>
        </Flex>
      </Box>
    </Box>
  )
}

export const RecentlySoldFragmentContainer = createFragmentContainer(RecentlySold, {
  artists: graphql`
    fragment RecentlySold_artists on Artist @relay(plural: true) {
      internalID
      targetSupply {
        microfunnel {
          artworksConnection(first: 1) {
            edges {
              node {
                slug
                internalID
                href
                artistNames
                image {
                  imageURL
                }
                realizedPrice
              }
            }
          }
        }
      }
    }
  `,
})

const RecentlySoldPlaceholder: React.FC = () => {
  return (
    <Box px={2}>
      <Box>
        <Sans size="4" mb={2}>
          Recently sold with Artsy
        </Sans>

        <Flex flexDirection="row">
          <Join separator={<Spacer mr={0.5} />}>
            {[...new Array(4)].map((_, index) => {
              return (
                <Box key={index}>
                  <PlaceholderBox width={120} height={120} marginRight={10} />
                  <Spacer mb={1} />
                  <PlaceholderText width={60} />
                  <PlaceholderText width={40} />
                </Box>
              )
            })}
          </Join>
        </Flex>
      </Box>
    </Box>
  )
}
