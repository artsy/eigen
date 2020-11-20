import { AuctionIcon, Box, EditIcon, Flex, PaymentIcon, Sans, Spacer } from "palette"
import React from "react"
import { TextContainer } from "./TextContainer"

export const HowItWorks: React.FC = () => {
  return (
    <Box px={2}>
      <Sans size="8">How it works</Sans>

      <Spacer mb={2} />
      <Flex flexDirection="row">
        <Box pr={2}>
          <EditIcon width={30} height={30} />
        </Box>

        <TextContainer>
          <Sans size="4">Submit Once</Sans>
          <Spacer mb={0.3} />
          <Sans color="black60" size="3t">
            With a single submission, you'll access art buyers around the world.
          </Sans>
        </TextContainer>
      </Flex>
      <Spacer mb={2} />
      <Flex flexDirection="row">
        <Box pr={2}>
          <AuctionIcon width={30} height={30} />
        </Box>

        <TextContainer>
          <Sans size="4">Make Your Sale</Sans>
          <Spacer mb={0.3} />
          <Sans color="black60" size="3t">
            Choose from several Artsy marketplace resale options.
          </Sans>
        </TextContainer>
      </Flex>
      <Spacer mb={2} />
      <Flex flexDirection="row">
        <Box pr={2}>
          <PaymentIcon width={30} height={30} />
        </Box>

        <TextContainer>
          <Sans size="4">Receive Payment</Sans>
          <Spacer mb={0.3} />
          <Sans color="black60" size="3t">
            We'll help you ship the work, and ensure you receive payment quickly.
          </Sans>
        </TextContainer>
      </Flex>
    </Box>
  )
}
