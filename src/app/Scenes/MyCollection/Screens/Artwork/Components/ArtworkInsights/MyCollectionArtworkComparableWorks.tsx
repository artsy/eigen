import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Separator } from "@artsy/palette-mobile"
import { MyCollectionArtworkComparableWorks_artwork$key } from "__generated__/MyCollectionArtworkComparableWorks_artwork.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface MyCollectionArtworkComparableWorksProps {
  artwork: MyCollectionArtworkComparableWorks_artwork$key
}

export const MyCollectionArtworkComparableWorks: React.FC<
  MyCollectionArtworkComparableWorksProps
> = (props) => {
  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, props.artwork)

  const comparableWorks = extractNodes(artwork?.comparableAuctionResults)

  if (!comparableWorks.length) {
    return null
  }

  return (
    <Flex>
      <SectionTitle title="Comparable Works" />

      {comparableWorks.map((item) => (
        <Flex my={1} mx={-2} key={item.internalID}>
          <AuctionResultListItemFragmentContainer
            auctionResult={item}
            onPress={() => {
              if (artwork.artist?.slug) {
                trackEvent(tracks.tappedAuctionResultGroup(artwork?.internalID, artwork?.slug))
              }
            }}
          />
        </Flex>
      ))}

      <Separator my={4} borderColor="mono10" />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkComparableWorks_artwork on Artwork {
    internalID
    slug
    artist {
      slug
    }
    comparableAuctionResults(first: 6) @optionalField {
      edges {
        node {
          internalID
          ...AuctionResultListItem_auctionResult
        }
      }
    }
  }
`

const tracks = {
  tappedShowMore: (internalID: string, slug: string) => ({
    action: ActionType.tappedShowMore,
    context_module: ContextModule.myCollectionComparableWorks,
    context_screen: OwnerType.myCollectionArtworkInsights,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
  }),
  tappedAuctionResultGroup: (internalID: string, slug: string) => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.myCollectionComparableWorks,
    context_screen: OwnerType.myCollectionArtworkInsights,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
  }),
}
