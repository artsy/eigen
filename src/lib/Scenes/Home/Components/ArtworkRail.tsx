import { Flex, Spacer, Theme } from "@artsy/palette"
import React, { useImperativeHandle, useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { FlatList, View } from "react-native"

import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { RailScrollProps } from "./types"

const RAIL_HEIGHT = 100

function getViewAllUrl(rail: ArtworkRail_rail) {
  const context = rail.context
  const key = rail.key

  switch (key) {
    case "followed_artists":
      return "/works-for-you"
    case "followed_artist":
    case "related_artists":
      return context?.artist?.href
    case "saved_works":
      return "/favorites"
    case "genes":
    case "current_fairs":
    case "live_auctions":
      return context?.href
  }
}

type ArtworkItem = NonNullable<NonNullable<ArtworkRail_rail["results"]>[0]>

const ArtworkRail: React.FC<{ rail: ArtworkRail_rail } & RailScrollProps> = ({ rail, scrollRef }) => {
  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: true }),
  }))

  const context = rail.context
  let subtitle: string | null = null
  if (context?.__typename === "HomePageRelatedArtistArtworkModule" && context.basedOn) {
    subtitle = `Based on ${context.basedOn.name}`
  } else if (rail.key === "recommended_works") {
    subtitle = `Based on your activity on Artsy`
  }
  const viewAllUrl = getViewAllUrl(rail)

  return rail.results?.length ? (
    <Theme>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle
            title={rail.title}
            subtitle={subtitle}
            onPress={
              viewAllUrl ? () => SwitchBoard.presentNavigationViewController(railRef.current!, viewAllUrl) : undefined
            }
          />
        </Flex>
        <AboveTheFoldFlatList<ArtworkItem>
          listRef={listRef}
          horizontal
          style={{ height: RAIL_HEIGHT }}
          ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
          ListFooterComponent={() => <Spacer mr={2}></Spacer>}
          ItemSeparatorComponent={() => <Spacer mr={0.5}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={rail.results as any /* TODO: fix this once MP's connections are non-nullable */}
          initialNumToRender={4}
          windowSize={3}
          renderItem={({ item }) => (
            <ArtworkCard
              onPress={
                item.href ? () => SwitchBoard.presentNavigationViewController(railRef.current!, item.href!) : undefined
              }
            >
              <OpaqueImageView
                imageURL={item.image?.imageURL?.replace(":version", "square")}
                width={RAIL_HEIGHT}
                height={RAIL_HEIGHT}
              />
            </ArtworkCard>
          )}
          keyExtractor={(item, index) => String(item.image?.imageURL || index)}
        />
      </View>
    </Theme>
  ) : null
}

const ArtworkCard = styled.TouchableHighlight`
  border-radius: 2px;
  overflow: hidden;
`

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
