import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NewWorksForYouRail_me$key } from "__generated__/NewWorksForYouRail_me.graphql"
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

interface NewWorksForYouRailProps {
  title: string
  me: NewWorksForYouRail_me$key
  mb?: number
}

export const NewWorksForYouRail: React.FC<NewWorksForYouRailProps & RailScrollProps> = ({
  title,
  me,
  scrollRef,
  mb,
}) => {
  const { trackEvent } = useTracking()

  const { newWorksByInterestingArtists } = useFragment(artworksFragment, me)

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const artworks = extractNodes(newWorksByInterestingArtists)

  if (!artworks.length) {
    return null
  }

  return (
    <Flex mb={mb}>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle
            title={title}
            onPress={() => {
              trackEvent(tracks.tappedHeader())
              navigate(`/new-works-for-you`)
            }}
          />
        </Flex>
        <SmallArtworkRail
          artworks={artworks}
          onPress={(artwork, position) => {
            trackEvent(
              HomeAnalytics.artworkThumbnailTapEvent(
                ContextModule.newWorksForYouRail,
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
  fragment NewWorksForYouRail_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
    newWorksByInterestingArtists(first: $count, after: $cursor)
      @connection(key: "NewWorksForYouRail_newWorksByInterestingArtists") {
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

const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.newWorksForYouRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.newWorksForYou,
    type: "header",
  }),
}
