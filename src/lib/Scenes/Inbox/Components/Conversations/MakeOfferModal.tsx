import { MakeOfferModal_artwork } from "__generated__/MakeOfferModal_artwork.graphql"
import { MakeOfferModalQuery, MakeOfferModalQueryResponse } from "__generated__/MakeOfferModalQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { CollapsibleArtworkDetailsFragmentContainer as CollapsibleArtworkDetails } from "lib/Scenes/Artwork/Components/CommercialButtons/CollapsibleArtworkDetails"
import { MakeOfferButtonFragmentContainer as MakeOfferButton } from "lib/Scenes/Artwork/Components/CommercialButtons/MakeOfferButton"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { BorderBox, Button, Flex, Text } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface MakeOfferModalProps {
  artwork: MakeOfferModal_artwork
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ ...props }) => {
  const { artwork } = props

  return (
    <View>
      <FancyModalHeader
        onLeftButtonPress={() => {
          dismissModal()
        }}
        leftButtonText="Cancel"
        rightButtonDisabled
        rightButtonText=" "
        hideBottomDivider
      ></FancyModalHeader>
      <Flex p="1.5">
        <Text variant="largeTitle">Confirm Artwork</Text>
        <Text variant="small" color="black60">
          {" "}
          Make sure the artwork below matches the intended work you're making an offer on.
        </Text>
        <BorderBox p={0} my="2">
          <CollapsibleArtworkDetails hasSeparator={false} artwork={artwork} />
        </BorderBox>
        <MakeOfferButton variant="primaryBlack" buttonText="Confirm" artwork={artwork} editionSetID={null} />
        <Button
          mt="1"
          size="large"
          variant="secondaryOutline"
          block
          width={100}
          onPress={() => {
            dismissModal()
          }}
        >
          Cancel
        </Button>
      </Flex>
    </View>
  )
}

export const MakeOfferModalFragmentContainer = createFragmentContainer(MakeOfferModal, {
  artwork: graphql`
    fragment MakeOfferModal_artwork on Artwork {
      ...CollapsibleArtworkDetails_artwork
      ...MakeOfferButton_artwork
    }
  `,
})

export const MakeOfferModalQueryRenderer: React.FC<{
  artworkID: string
}> = ({ artworkID }) => {
  return (
    <QueryRenderer<MakeOfferModalQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MakeOfferModalQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            ...MakeOfferModal_artwork
          }
        }
      `}
      variables={{
        artworkID,
      }}
      render={renderWithLoadProgress<MakeOfferModalQueryResponse>(({ artwork }) => (
        <MakeOfferModalFragmentContainer artwork={artwork!} />
      ))}
    />
  )
}
