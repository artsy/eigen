import { ContextModule, OwnerType, TappedConsignArgs } from "@artsy/cohesion"
import { Box, Button, Flex, Spacer, Text } from "palette"
import styled from "styled-components/native"
import { TextContainer } from "./TextContainer"

const consignArgs: TappedConsignArgs = {
  contextModule: ContextModule.sellFooter,
  contextScreenOwnerType: OwnerType.sell,
  subject: "Submit a work",
}

interface OldFooterProps {
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}

export const OldFooter: React.FC<OldFooterProps> = ({ onConsignPress }) => {
  const handlePress = () => {
    onConsignPress(consignArgs)
  }

  return (
    <Box px={2} pb={6}>
      <Text variant="lg-display">Why sell with Artsy?</Text>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text variant="sm-display">1</Text>
        </NumberBox>

        <TextContainer>
          <Text variant="sm-display">Simple Steps</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            Submit your work once, pick the best offer, and ship the work when it sells.
          </Text>
        </TextContainer>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text variant="sm-display">2</Text>
        </NumberBox>

        <TextContainer>
          <Text variant="sm-display">Industry Expertise</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            Receive virtual valuation and expert guidance on the best sales strategies.
          </Text>
        </TextContainer>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text variant="sm-display">3</Text>
        </NumberBox>

        <TextContainer>
          <Text variant="sm-display">Global Reach</Text>
          <Spacer mb={0.3} />
          <Text variant="sm" color="black60">
            Your work will reach the world's collectors, galleries, and auction houses.
          </Text>
        </TextContainer>
      </Flex>

      <Spacer mb={3} />

      <Button testID="footer-cta" variant="fillDark" block onPress={handlePress} haptic>
        <Text variant="sm">Submit a work</Text>
      </Button>
    </Box>
  )
}

const NumberBox = styled(Box)`
  flex-basis: 30px;
  flex-shrink: 0;
  flex-grow: 0;
`
