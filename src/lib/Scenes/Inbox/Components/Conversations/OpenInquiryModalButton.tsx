import { navigate } from "lib/navigation/navigate"
import { Button, Flex, Separator } from "palette"
import React from "react"
import styled from "styled-components/native"

export interface OpenInquiryModalButtonProps {
  artworkID: string
  conversationID: string | null | undefined
}

const ShadowSeparator = styled(Separator)`
  box-shadow: 0 -1px 1px rgba(50, 50, 50, 0.1);
  width: 100%;
  height: 0;
`

export const OpenInquiryModalButton: React.FC<OpenInquiryModalButtonProps> = ({ artworkID, conversationID }) => {
  return (
    <>
      <ShadowSeparator />
      <Flex p={1.5}>
        <Button
          onPress={() => {
            navigate(`make-offer/${artworkID}`, {
              modal: true,
              passProps: { conversationID },
            })
          }}
          size="large"
          variant="primaryBlack"
          block
          width={100}
        >
          Make Offer
        </Button>
      </Flex>
    </>
  )
}
