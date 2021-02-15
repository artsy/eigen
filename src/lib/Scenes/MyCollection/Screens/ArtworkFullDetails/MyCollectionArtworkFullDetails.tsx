import { editCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkFullDetails_artwork } from "__generated__/MyCollectionArtworkFullDetails_artwork.graphql"
import { MyCollectionArtworkFullDetailsQuery } from "__generated__/MyCollectionArtworkFullDetailsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { popParentViewController } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore } from "lib/store/GlobalStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Spacer } from "palette"
import React, { useState } from "react"
import { ActivityIndicator } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkMetaFragmentContainer } from "../Artwork/Components/MyCollectionArtworkMeta"
import { MyCollectionArtworkFormModal } from "../ArtworkFormModal/MyCollectionArtworkFormModal"

const MyCollectionArtworkFullDetails: React.FC<{ artwork: MyCollectionArtworkFullDetails_artwork }> = (props) => {
  const { trackEvent } = useTracking()
  const [showModal, setShowModal] = useState(false)
  return (
    <Flex>
      <FancyModalHeader
        rightButtonText="Edit"
        onRightButtonPress={() => {
          trackEvent(tracks.editCollectedArtwork(props.artwork.internalID, props.artwork.slug))
          GlobalStore.actions.myCollection.artwork.startEditingArtwork(props.artwork as any)
          setShowModal(true)
        }}
      >
        Artwork Details
      </FancyModalHeader>
      <Spacer my="0.5" />
      <MyCollectionArtworkMetaFragmentContainer artwork={props.artwork} viewAll />

      <MyCollectionArtworkFormModal
        onDelete={() => {
          setShowModal(false)
          // pop twice to take user back to my collection list
          setTimeout(() => {
            popParentViewController()
            popParentViewController()
          }, 50)
        }}
        onSuccess={() => {
          setShowModal(false)
          // pop once to take user back to main details page
          setTimeout(popParentViewController, 50)
        }}
        artwork={props.artwork}
        mode="edit"
        visible={showModal}
        onDismiss={() => setShowModal(false)}
      />
    </Flex>
  )
}

export const MyCollectionArtworkFullDetailsContainer = createFragmentContainer(MyCollectionArtworkFullDetails, {
  artwork: graphql`
    fragment MyCollectionArtworkFullDetails_artwork on Artwork {
      ...MyCollectionArtwork_sharedProps @relay(mask: false)
      ...MyCollectionArtworkMeta_artwork
      internalID
      slug
    }
  `,
})

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
