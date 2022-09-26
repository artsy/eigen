import { ContextModule, OwnerType, TappedConsignArgs } from "@artsy/cohesion"
import { Box, Button, Flex, Spacer, Text } from "palette"
import styled from "styled-components/native"
import { TextContainer } from "./TextContainer"

const consignArgs: TappedConsignArgs = {
  contextModule: ContextModule.sellFooter,
  contextScreenOwnerType: OwnerType.sell,
  subject: "Submit a work",
}

interface FooterProps {
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}

export const Footer: React.FC<FooterProps> = ({ onConsignPress }) => {
  const handlePress = () => {
    onConsignPress(consignArgs)
  }

  return (
    <Box px={2} pb={6}>
      <Text variant="lg">Why sell with Artsy?</Text>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text>1</Text>
        </NumberBox>

        <TextContainer>
          <Text>Simple Steps</Text>
          <Spacer mb={0.3} />
          <Text color="black60">
            Submit your work once, pick the best offer, and ship the work when it sells.
          </Text>
        </TextContainer>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text>2</Text>
        </NumberBox>

        <TextContainer>
          <Text>Industry Expertise</Text>
          <Spacer mb={0.3} />
          <Text color="black60">
            Receive virtual valuation and expert guidance on the best sales strategies.
          </Text>
        </TextContainer>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <NumberBox pl={0.5} pr={1}>
          <Text>3</Text>
        </NumberBox>

        <TextContainer>
          <Text>Global Reach</Text>
          <Spacer mb={0.3} />
          <Text color="black60">
            Your work will reach the world's collectors, galleries, and auction houses.
          </Text>
        </TextContainer>
      </Flex>

      <Spacer mb={3} />

      <Button testID="footer-cta" variant="fillDark" block onPress={handlePress} haptic>
        <Text>Submit a work</Text>
      </Button>
    </Box>
  )
}

const NumberBox = styled(Box)`
  flex-basis: 30px;
  flex-shrink: 0;
  flex-grow: 0;
`
