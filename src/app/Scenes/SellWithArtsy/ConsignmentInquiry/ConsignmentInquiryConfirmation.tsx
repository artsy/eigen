import { ArtsyLogoBlackIcon } from "@artsy/palette-mobile"
import { popToRoot } from "app/system/navigation/navigate"
import { Box, Button, Flex, Text } from "palette"

export const ConsignmentInquiryConfirmation: React.FC<{}> = () => {
  return (
    <Box mt={2} px={2}>
      <Flex mb={4}>
        <ArtsyLogoBlackIcon scale={0.75} />
      </Flex>
      <Text variant="lg-display" mb={2}>
        Your message has been sent
      </Text>
      <Text color="black60" variant="sm-display" mb={4}>
        An Artsy specialist will be in touch to find out more about how we can assist you.
      </Text>
      <Button
        onPress={() => popToRoot()}
        block
        variant="fillDark"
        size="large"
        testID="back-to-swa-button"
      >
        Back to Sell with Artsy
      </Button>
    </Box>
  )
}
