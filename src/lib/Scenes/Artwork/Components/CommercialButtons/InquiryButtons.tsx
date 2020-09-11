import { InquiryButtons_artwork } from "__generated__/InquiryButtons_artwork.graphql"
import { Button, ButtonVariant } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { InquiryModal } from "./InquiryModal"

export interface InquiryButtonsProps {
  artwork: InquiryButtons_artwork
  relay: RelayProp
  // EditionSetID is passed down from the edition selected by the user
  editionSetID?: string
  variant?: ButtonVariant
}

export interface InquiryButtonsState {
  modalIsVisible: boolean
}

export const InquiryButtons: React.FC<InquiryButtonsProps> = ({ artwork, relay, ...props }) => {
  const [modalVisibility, setModalVisibility] = useState(false)

  return (
    <>
      {!!artwork.isPriceHidden && (
        <Button onPress={() => setModalVisibility(true)} size="large" mb={1} block width={100} variant={props.variant}>
          Request Price
        </Button>
      )}
      {!artwork.isPriceHidden && (
        <Button onPress={() => setModalVisibility(true)} size="large" mb={1} block width={100} variant={props.variant}>
          Inquire to Purchase
        </Button>
      )}
      <Button onPress={() => setModalVisibility(true)} size="large" block width={100} variant="secondaryOutline">
        Contact Gallery
      </Button>
      <InquiryModal
        artwork={artwork}
        modalIsVisible={modalVisibility}
        toggleVisibility={() => setModalVisibility(!modalVisibility)}
      />
    </>
  )
}

export const InquiryButtonsFragmentContainer = createFragmentContainer(InquiryButtons, {
  artwork: graphql`
    fragment InquiryButtons_artwork on Artwork {
      internalID
      isPriceHidden
      title
      date
      medium
      dimensions {
        in
        cm
      }
      editionOf
      signatureInfo {
        details
      }
      artist {
        name
      }
    }
  `,
})
