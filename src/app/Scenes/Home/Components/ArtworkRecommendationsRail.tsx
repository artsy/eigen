import { ContextModule } from "@artsy/cohesion"
import { ArtworkRecommendationsRail_me$key } from "__generated__/ArtworkRecommendationsRail_me.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"
import { RailScrollProps } from "./types"

interface ArtworkRecommendationsRailProps {
  title: string
  me: ArtworkRecommendationsRail_me$key
  mb?: number
}

export const ArtworkRecommendationsRail: React.FC<
  ArtworkRecommendationsRailProps & RailScrollProps
> = ({ title, me, scrollRef, mb }) => {
  const { trackEvent } = useTracking()

  const { artworkRecommendations } = useFragment(artworksFragment, me)

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const artworks = extractNodes(artworkRecommendations)

  if (!artworks.length) {
    return null
  }

  return (
    <Flex mb={mb}>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle title={title} />
        </Flex>
        <SmallArtworkRail
          artworks={artworks}
          onPress={(artwork, position) => {
            trackEvent(
              HomeAnalytics.artworkThumbnailTapEvent(
                ContextModule.artworkRecommendationsRail,
                artwork.slug,
                position,
                "single"
              )
            )
            navigate(artwork.href!)
          }}
        />
      </View>
    </Flex>
  )
}

const artworksFragment = graphql`
  fragment ArtworkRecommendationsRail_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
    artworkRecommendations(first: $count, after: $cursor)
      @connection(key: "ArtworkRecommendationsRail_artworkRecommendations") {
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        node {
          ...SmallArtworkRail_artworks
        }
      }
    }
  }
`
