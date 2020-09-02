import { InquiryButtons_artwork } from "__generated__/InquiryButtons_artwork.graphql"
import { Button, ButtonVariant, MessageIcon } from "palette"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

export interface InquiryButtonsProps {
  artwork: InquiryButtons_artwork
  relay: RelayProp
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
  variant?: ButtonVariant
}

export class InquiryButtons extends React.Component<InquiryButtonsProps> {
  render() {
    const { artwork } = this.props
    return (
      <>
        {artwork.isPriceHidden && (
          <Button size="large" block width={100} variant={this.props.variant}>
            Request Price
          </Button>
        )}
        {!artwork.isPriceHidden && (
          <Button size="large" block width={100} variant={this.props.variant}>
            <MessageIcon />
            Inquire to Purchase
          </Button>
        )}
        <Button size="large" block width={100} variant={this.props.variant}>
          Contact Gallery
        </Button>
      </>
    )
  }
}

export const InquiryButtonsFragmentContainer = createFragmentContainer(InquiryButtons, {
  artwork: graphql`
    fragment InquiryButtons_artwork on Artwork {
      internalID
      isPriceHidden
    }
  `,
})
