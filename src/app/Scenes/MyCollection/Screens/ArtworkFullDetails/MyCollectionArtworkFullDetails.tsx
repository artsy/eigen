import { editCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkFullDetails_artwork } from "__generated__/MyCollectionArtworkFullDetails_artwork.graphql"
import { MyCollectionArtworkFullDetailsQuery } from "__generated__/MyCollectionArtworkFullDetailsQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { navigate, popParentViewController, popToRoot } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Flex, Spacer } from "palette"
import { useCallback } from "react"
import { ActivityIndicator } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkMetaFragmentContainer } from "../Artwork/Components/MyCollectionArtworkMeta"

const MyCollectionArtworkFullDetails: React.FC<{
  artwork: MyCollectionArtworkFullDetails_artwork
}> = (props) => {
  const { trackEvent } = useTracking()

  const handleEdit = useCallback(() => {
    trackEvent(tracks.editCollectedArtwork(props.artwork.internalID, props.artwork.slug))
    GlobalStore.actions.myCollection.artwork.startEditingArtwork(props.artwork as any)
    navigate(`my-collection/artworks/${props.artwork.internalID}/edit`, {
      passProps: {
        mode: "edit",
        artwork: props.artwork,
        onSuccess: popParentViewController,
        onDelete: popToRoot,
      },
    })
  }, [props.artwork])

  return (
    <Flex>
      <FancyModalHeader
        rightButtonText="Edit"
        onRightButtonPress={!props.artwork.consignmentSubmission ? handleEdit : undefined}
      >
        Artwork Details
      </FancyModalHeader>
      <Spacer my={0.5} />
      <MyCollectionArtworkMetaFragmentContainer artwork={props.artwork} viewAll />
    </Flex>
  )
}

export const MyCollectionArtworkFullDetailsContainer = createFragmentContainer(
  MyCollectionArtworkFullDetails,
  {
    artwork: graphql`
      fragment MyCollectionArtworkFullDetails_artwork on Artwork {
        ...OldMyCollectionArtwork_sharedProps @relay(mask: false)
        ...MyCollectionArtworkMeta_artwork
        internalID
        slug
      }
    `,
  }
)

export const MyCollectionArtworkFullDetailsQueryRenderer: React.FC<{
  artworkSlug: string
}> = ({ artworkSlug }) => {
  return (
    <QueryRenderer<MyCollectionArtworkFullDetailsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionArtworkFullDetailsQuery($artworkSlug: String!) {
          artwork(id: $artworkSlug) {
            ...MyCollectionArtworkFullDetails_artwork
          }
        }
      `}
      variables={{
        artworkSlug,
      }}
      render={renderWithPlaceholder({
        Container: MyCollectionArtworkFullDetailsContainer,
        renderPlaceholder: () => (
          <Flex flexGrow={1}>
            <FancyModalHeader>Artwork Details</FancyModalHeader>
            <Flex alignItems="center" justifyContent="center" flexGrow={1}>
              <ActivityIndicator />
            </Flex>
          </Flex>
        ),
      })}
    />
  )
}

const tracks = {
  editCollectedArtwork: (internalID: string, slug: string) => {
    return editCollectedArtwork({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
