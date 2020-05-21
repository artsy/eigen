import { Box, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { RecentlySold_artists } from "__generated__/RecentlySold_artists.graphql"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import React, { useRef } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface RecentlySoldProps {
  isLoading?: boolean
  artists: RecentlySold_artists
}

export const RecentlySold: React.FC<RecentlySoldProps> = ({ artists, isLoading }) => {
  if (isLoading) {
    return <RecentlySoldPlaceholder />
  }

  const navRef = useRef<any>()

  return (
    <Box px={2} ref={navRef}>
      <Box>
        <Sans size="4" mb={2}>
          Recently sold with Artsy
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

                return (
                  <ArtworkTileRailCard
                    imageURL={artwork?.node?.image?.imageURL}
                    artistNames={artwork?.node?.artistNames}
                    saleMessage={`Sold for ${artwork?.node?.realizedPrice}`}
                    key={artwork?.node?.internalID}
                    onPress={() => {
                      // FIXME: Wire up tracking
                      // tracking.trackEvent(
                      //   tappedArtworkGroupThumbnail(contextModule, item!.node!.internalID, item!.node!.slug)
                      // )
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
