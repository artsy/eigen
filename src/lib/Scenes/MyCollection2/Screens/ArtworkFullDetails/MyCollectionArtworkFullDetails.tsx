import { MyCollectionArtworkFullDetails_artwork } from "__generated__/MyCollectionArtworkFullDetails_artwork.graphql"
import { MyCollectionArtworkFullDetailsQuery } from "__generated__/MyCollectionArtworkFullDetailsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { MyCollectionArtworkFormModal } from "../../Components/ArtworkFormModal/MyCollectionArtworkFormModal"
import { MyCollectionArtworkMetaFragmentContainer } from "../Artwork/Components/MyCollectionArtworkMeta2"

const MyCollectionArtworkFullDetails: React.FC<{ artwork: MyCollectionArtworkFullDetails_artwork }> = (props) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <Flex>
      <FancyModalHeader
        rightButtonText="Edit"
        onRightButtonPress={() => {
          setShowModal(true)
        }}
      >
        Artwork Details
      </FancyModalHeader>
      <Spacer my={0.5} />
      <MyCollectionArtworkMetaFragmentContainer artwork={props.artwork} viewAll />

      <MyCollectionArtworkFormModal
        onDelete={() => {
          goBack()
          goBack()
        }}
        onSuccess={() => {
          setShowModal(false)
        }}
        artwork={null as any}
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
      ...MyCollectionArtworkMeta2_artwork
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
        renderPlaceholder: () => <Text mt="6">TODO</Text>,
      })}
    />
  )
}
