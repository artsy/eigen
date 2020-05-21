import { Box, Button, Flex, Sans, Spacer } from "@artsy/palette"
import React from "react"
import styled from "styled-components/native"
import { useCTA } from "../Utils/useCTA"
import { TextContainer } from "./TextContainer"

export const FooterCTA: React.FC = () => {
  const { handleCTAPress } = useCTA()

  return (
    <Box px={2} pb={6}>
      <Sans size="8">Why sell with Artsy?</Sans>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Sans size="4">1</Sans>
        </NumberBox>

        <TextContainer>
          <Sans size="4">Simple Steps</Sans>
          <Spacer mb={0.3} />
          <Sans color="black60" size="3t">
            Submit your work once, pick the best offer, and ship the work when it sells.
          </Sans>
        </TextContainer>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Sans size="4">2</Sans>
        </NumberBox>

        <TextContainer>
          <Sans size="4">Industry Expertise</Sans>
          <Spacer mb={0.3} />
          <Sans color="black60" size="3t">
            Receive virtual valuation and expert guidance on the best sales strategies.
          </Sans>
        </TextContainer>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Sans size="4">3</Sans>
        </NumberBox>

        <TextContainer>
          <Sans size="4">Global Reach</Sans>
          <Spacer mb={0.3} />
          <Sans color="black60" size="3t">
            Your work will reach the world's collectors, galleries, and auction houses.
          </Sans>
        </TextContainer>
      </Flex>

      <Spacer mb={3} />

      <Button variant="primaryBlack" block onPress={handleCTAPress}>
        <Sans size="3">Start selling</Sans>
      </Button>
    </Box>
  )
}

const NumberBox = styled(Box)`
  flex-basis: 30px;
  flex-shrink: 0;
  flex-grow: 0;
`
