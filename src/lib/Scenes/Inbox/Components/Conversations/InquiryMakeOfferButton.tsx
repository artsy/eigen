import { Button, Flex, Separator } from "palette"
import React, { useState } from "react"
import styled from "styled-components/native"
import { MakeOfferModalQueryRenderer as MakeOfferModal } from "./MakeOfferModal"

export interface InquiryMakeOfferButtonProps {
  artworkID: string
}

const ShadowSeparator = styled(Separator)`
  box-shadow: 0 -1px 1px rgba(50, 50, 50, 0.1);
  width: 100%;
  height: 0;
`

export const InquiryMakeOfferButton: React.FC<InquiryMakeOfferButtonProps> = ({ artworkID }) => {
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
