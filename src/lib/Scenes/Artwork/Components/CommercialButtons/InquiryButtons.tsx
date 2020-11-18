import { InquiryButtons_artwork } from "__generated__/InquiryButtons_artwork.graphql"
import { ArtworkInquiryContext, ArtworkInquiryStateProvider } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryTypes } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { InquiryOptions } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { Button, ButtonVariant } from "palette"
import React, { useContext, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { InquiryModalFragmentContainer } from "./InquiryModal"
export interface InquiryButtonsProps {
  artwork: InquiryButtons_artwork
  // EditionSetID is passed down from the edition selected by the user
  editionSetID?: string
  variant?: ButtonVariant
}

export interface InquiryButtonsState {
  modalIsVisible: boolean
}

const InquiryButtons: React.FC<InquiryButtonsProps> = ({ artwork }) => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const { dispatch } = useContext(ArtworkInquiryContext)
  const dispatchAction = (buttonText: string) => {
    dispatch({
      type: "selectInquiryType",
      payload: buttonText as InquiryTypes,
    })

    setModalVisibility(true)
  }

  return (
    <>
      <Button
        onPress={() => dispatchAction(InquiryOptions.ContactGallery)}
        size="large"
        block
        width={100}
        variant="secondaryOutline"
      >
        {InquiryOptions.ContactGallery}
      </Button>
      <InquiryModalFragmentContainer
        artwork={artwork}
        modalIsVisible={modalVisibility}
        toggleVisibility={() => setModalVisibility(!modalVisibility)}
      />
    </>
  )
}

const InquiryButtonsWrapper: React.FC<InquiryButtonsProps> = (props) => (
  <ArtworkInquiryStateProvider>
    <InquiryButtons {...props} />
  </ArtworkInquiryStateProvider>
)

export const InquiryButtonsFragmentContainer = createFragmentContainer(InquiryButtonsWrapper, {
  artwork: graphql`
    fragment InquiryButtons_artwork on Artwork {
      image {
        url
        width
        height
      }
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
      ...InquiryModal_artwork
    }
  `,
})
