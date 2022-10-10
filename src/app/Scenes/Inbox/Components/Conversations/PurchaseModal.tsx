import { ActionType, OwnerType } from "@artsy/cohesion"
import { PurchaseModal_artwork$data } from "__generated__/PurchaseModal_artwork.graphql"
import { PurchaseModalQuery } from "__generated__/PurchaseModalQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { CollapsibleArtworkDetailsFragmentContainer as CollapsibleArtworkDetails } from "app/Scenes/Artwork/Components/CommercialButtons/CollapsibleArtworkDetails"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { BorderBox, Button, Flex, Text } from "palette"
import React, { useState } from "react"
import { ScrollView, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { EditionSelectBoxFragmentContainer } from "./EditionSelectBox"
import { InquiryPurchaseButtonFragmentContainer } from "./InquiryPurchaseButton"

interface PurchaseModalProps {
  artwork: PurchaseModal_artwork$data
  conversationID: string
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ ...props }) => {
  const { artwork, conversationID } = props
  const { editionSets } = artwork

  const knownEditionSets = editionSets as unknown as Array<{ internalID: string }>
  const [selectedEdition, setSelectedEdition] = useState<string | null>(
    editionSets?.length === 1 ? knownEditionSets[0].internalID : null
  )

  const selectEdition = (editionSetID: string, isAvailable?: boolean) => {
    if (isAvailable) {
      setSelectedEdition(editionSetID)
    }
  }

  return (
    <View>
      <FancyModalHeader rightButtonDisabled hideBottomDivider>
        Purchase
      </FancyModalHeader>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex p={1.5}>
          <Text variant="lg">Select edition set</Text>
          <BorderBox p={0} my={2}>
            <CollapsibleArtworkDetails hasSeparator={false} artwork={artwork} />
          </BorderBox>
          {!!artwork.isEdition && artwork.editionSets!.length > 1 && (
            <Flex mb={2}>
              {artwork.editionSets?.map((edition) => (
                <EditionSelectBoxFragmentContainer
                  editionSet={edition!}
                  selected={edition!.internalID === selectedEdition}
                  onPress={selectEdition}
                  key={`edition-set-${edition?.internalID}`}
                />
              ))}
            </Flex>
          )}
          <InquiryPurchaseButtonFragmentContainer
            artwork={artwork}
            disabled={!!artwork.isEdition && !selectedEdition}
            editionSetID={selectedEdition ? selectedEdition : null}
            conversationID={conversationID}
          >
            Confirm
          </InquiryPurchaseButtonFragmentContainer>
          <Button
            mt={1}
            size="large"
            variant="outline"
            block
            width={100}
            onPress={() => {
              dismissModal()
            }}
          >
            Cancel
          </Button>
        </Flex>
      </ScrollView>
    </View>
  )
}

export const PurchaseModalFragmentContainer = createFragmentContainer(PurchaseModal, {
  artwork: graphql`
    fragment PurchaseModal_artwork on Artwork {
      ...CollapsibleArtworkDetails_artwork
      ...InquiryPurchaseButton_artwork
      internalID
      isEdition
      editionSets {
        ...EditionSelectBox_editionSet
        internalID
      }
    }
  `,
})

export const PurchaseModalQueryRenderer: React.FC<{
  artworkID: string
  conversationID: string
}> = ({ artworkID, conversationID }) => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={{
        action: ActionType.screen,
        context_screen_owner_type: OwnerType.conversation,
        context_screen_referrer_type: OwnerType.conversation,
      }}
    >
      <QueryRenderer<PurchaseModalQuery>
        environment={defaultEnvironment}
        query={graphql`
          query PurchaseModalQuery($artworkID: String!) {
            artwork(id: $artworkID) {
              ...PurchaseModal_artwork
            }
          }
        `}
        variables={{
          artworkID,
        }}
        render={renderWithLoadProgress<PurchaseModalQuery["response"]>(({ artwork }) => (
          <PurchaseModalFragmentContainer artwork={artwork!} conversationID={conversationID} />
        ))}
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
