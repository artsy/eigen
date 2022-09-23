import { AuctionIcon, Box, EditIcon, Flex, PaymentIcon, Spacer, Text } from "palette"
import { TextContainer } from "./TextContainer"

export const OldHowItWorks: React.FC = () => {
  return (
    <Box px={2}>
      <Text variant="lg">How it works</Text>

      <Spacer mb={2} />
      <Flex flexDirection="row">
        <Box pr={2}>
          <EditIcon width={30} height={30} />
        </Box>

        <TextContainer>
          <Text variant="md">Submit Once</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            With a single submission, you'll access art buyers around the world.
          </Text>
        </TextContainer>
      </Flex>
      <Spacer mb={2} />
      <Flex flexDirection="row">
        <Box pr={2}>
          <AuctionIcon width={30} height={30} />
        </Box>

        <TextContainer>
          <Text variant="md">Make Your Sale</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            Choose from several Artsy marketplace resale options.
          </Text>
        </TextContainer>
      </Flex>
      <Spacer mb={2} />
      <Flex flexDirection="row">
        <Box pr={2}>
          <PaymentIcon width={30} height={30} />
        </Box>

        <TextContainer>
          <Text variant="md">Receive Payment</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            We'll help you ship the work, and ensure you receive payment quickly.
          </Text>
        </TextContainer>
      </Flex>
    </Box>
  )
}
