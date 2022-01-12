import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NewWorksForYouRail_me } from "__generated__/NewWorksForYouRail_me.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkRail } from "./ArtworkRail"
import { RailScrollProps } from "./types"
interface NewWorksForYouRailProps {
  title: string
  me: NewWorksForYouRail_me
  mb?: number
}

const NewWorksForYouRail: React.FC<NewWorksForYouRailProps & RailScrollProps> = ({ title, me, scrollRef, mb }) => {
  const { trackEvent } = useTracking()

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  // This is to satisfy the TypeScript compiler based on Metaphysics types.
  const artworks = extractNodes(me?.newWorksByInterestingArtists)

  if (!artworks.length) {
    return null
  }

  const navigateToNewWorksForYou = () => {
    trackEvent(tracks.tappedHeader())
    navigate(`/new-works-for-you`)
  }

  return (
    <Flex mb={mb}>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle title={title} onPress={navigateToNewWorksForYou} />
        </Flex>
        {<ArtworkRail listRef={listRef} artworks={artworks} contextModule={ContextModule.newWorksForYouRail} />}
      </View>
    </Flex>
  )
}

export const NewWorksForYouRailContainer = createFragmentContainer(NewWorksForYouRail, {
  me: graphql`
    fragment NewWorksForYouRail_me on Me @argumentDefinitions(count: { type: "Int", defaultValue: 30 }) {
      newWorksByInterestingArtists(first: $count) {
        edges {
          node {
            ...ArtworkRail_artworks
          }
        }
      }
    }
  `,
})

const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.newWorksForYouRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.newWorksForYou,
    type: "header",
  }),
}
