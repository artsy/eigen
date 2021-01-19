import { Conversation_me } from "__generated__/Conversation_me.graphql"
import { Button, Flex, Separator } from "palette"
import React, { useState } from "react"
import styled from "styled-components/native"
import { MakeOfferModalQueryRenderer as MakeOfferModal } from "./MakeOfferModal"

// type Item = NonNullable<NonNullable<NonNullable<Conversation_me["conversation"]>["items"]>[0]>["item"]

export interface InquiryMakeOfferButtonProps {
  // artwork: InquiryMakeOfferButton_artwork
  // // EditionSetID is passed down from the edition selected by the user
  // editionSetID?: string
  artworkID: string
}

const ShadowSeparator = styled(Separator)`
  box-shadow: -1px -1px 1px rgba(50, 50, 50, 0.75);
  width: 100%;
  height: 0;
`

export const InquiryMakeOfferButton: React.FC<InquiryMakeOfferButtonProps> = ({ artworkID }) => {
  // export const InquiryMakeOfferButton: React.FC = () => {
  const [modalVisibility, setModalVisibility] = useState(false)

  return (
    <>
      <ShadowSeparator />
      <Flex p={1.5}>
        <Button
          onPress={() => {
            setModalVisibility(true)
          }}
          size="large"
          variant="primaryBlack"
          block
          width={100}
        >
          Make Offer
        </Button>
      </Flex>
      <MakeOfferModal
        artworkID={artworkID}
        toggleVisibility={() => setModalVisibility(!modalVisibility)}
        modalIsVisible={modalVisibility}
      />
    </>
  )
}
