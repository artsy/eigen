import { Box, Flex, Spacer, Text } from "palette"
import styled from "styled-components/native"
import { TextContainer } from "./TextContainer"

export const WhySellWithArtsy: React.FC = () => {
  return (
    <Box px={2}>
      <Text variant="lg">Why sell with Artsy?</Text>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text variant="md">1</Text>
        </NumberBox>

        <TextContainer>
          <Text variant="md">Simple Steps</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            Submit your work once, pick the best offer, and ship the work when it sells.
          </Text>
        </TextContainer>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text variant="md">2</Text>
        </NumberBox>

        <TextContainer>
          <Text variant="md">Industry Expertise</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            Receive virtual valuation and expert guidance on the best sales strategies.
          </Text>
        </TextContainer>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text variant="md">3</Text>
        </NumberBox>

        <TextContainer>
          <Text variant="md">Global Reach</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            Your work will reach the world's collectors, galleries, and auction houses.
          </Text>
        </TextContainer>
      </Flex>
    </Box>
  )
}

const NumberBox = styled(Box)`
  flex-basis: 30px;
  flex-shrink: 0;
  flex-grow: 0;
`
