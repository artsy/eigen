import { Flex, Spacer, Theme } from "@artsy/palette"
import React, { useRef, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { FlatList, TouchableHighlight, View } from "react-native"

import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { SectionTitle } from "../../../../../Components/SectionTitle"

const RAIL_HEIGHT = 100

function getViewAllUrl(rail: ArtworkRail_rail) {
  const context = rail.context
  const key = rail.key

  switch (key) {
    case "followed_artists":
      return "/works-for-you"
    case "followed_artist":
    case "related_artists":
      return context.artist.href
    case "saved_works":
      return "/favorites"
    case "genes":
    case "current_fairs":
    case "live_auctions":
      return context?.href
  }
}

type ArtworkItem = ArtworkRail_rail["results"][0]

const ArtworkRail: React.FC<{ rail: ArtworkRail_rail }> = ({ rail }) => {
  const railRef = useRef()
  const [userHasScrolled, setUserHasScrolled] = useState(false)
  const context = rail.context
  let subtitle: React.ReactChild = null
  if (context?.__typename === "HomePageRelatedArtistArtworkModule") {
    subtitle = `Based on ${context.basedOn.name}`
  }
  const viewAllUrl = getViewAllUrl(rail)
  return (
    <Theme>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle
            title={rail.title}
            subtitle={subtitle}
            onPress={viewAllUrl && (() => SwitchBoard.presentNavigationViewController(railRef.current, viewAllUrl))}
          />
        </Flex>
        <FlatList<ArtworkItem>
          horizontal
          style={{ height: RAIL_HEIGHT }}
          ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
          ListFooterComponent={() => <Spacer mr={2}></Spacer>}
          ItemSeparatorComponent={() => <Spacer mr={0.5}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={rail.results}
          initialNumToRender={4}
          windowSize={userHasScrolled ? 3 : 1}
          onScrollBeginDrag={() => setUserHasScrolled(true)}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => SwitchBoard.presentNavigationViewController(railRef.current, item.href)}>
              <OpaqueImageView
                imageURL={item.image.imageURL.replace(":version", "square")}
                width={RAIL_HEIGHT}
                height={RAIL_HEIGHT}
              ></OpaqueImageView>
            </TouchableHighlight>
          )}
          keyExtractor={item => String(item.image.imageURL)}
        ></FlatList>
      </View>
    </Theme>
  )
}

export const ArtworkRailFragmentContainer = createFragmentContainer(ArtworkRail, {
  rail: graphql`
    fragment ArtworkRail_rail on HomePageArtworkModule {
      title
      key
      results {
        href
        image {
          imageURL
        }
      }
      context {
        ... on HomePageRelatedArtistArtworkModule {
          __typename
          artist {
            slug
            internalID
            href
          }
          basedOn {
            name
          }
        }
        ... on HomePageFollowedArtistArtworkModule {
          artist {
            href
          }
        }
        ... on Fair {
          href
        }
        ... on Gene {
          href
        }
        ... on Sale {
          href
        }
      }
    }
  `,
})
