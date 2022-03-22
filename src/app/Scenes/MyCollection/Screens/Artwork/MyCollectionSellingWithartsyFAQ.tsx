import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Box, Flex, Join, Spacer, Text } from "palette"
import { ScrollView } from "react-native"

export const MyCollectionSellingWithartsyFAQ: React.FC = () => {
  const { safeAreaInsets } = useScreenDimensions()

  return (
    <ScrollView>
      <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2}>
        <Box my={2}>
          <Join separator={<Spacer my={1} />}>
            <Text variant="lg" mb={2}>
              How It Works
            </Text>

            <Join separator={<Spacer my={0} />}>
              <Flex mb={0}>
                <Text caps variant="xs">
                  Submit your artwork
                </Text>
              </Flex>
              <Flex flexDirection="column">
                <Text mb={1}>
                  Submit your artwork details and images. Artsy will review and approve qualified
                  submissions.
                </Text>
              </Flex>
            </Join>

            <Join separator={<Spacer my={0} />}>
              <Flex mb={0}>
                <Text caps variant="xs">
                  Receive multiple offers
                </Text>
              </Flex>
              <Flex flexDirection="column">
                <Text mb={1}>
                  If your work is accepted, you’ll receive competitive offers from Artsy’s curated
                  auctions, auction houses, and galleries.
                </Text>
              </Flex>
            </Join>

            <Join separator={<Spacer my={0} />}>
              <Flex mb={0}>
                <Text caps variant="xs">
                  Match and sell
                </Text>
              </Flex>
              <Flex flexDirection="column">
                <Text mb={1}>
                  Our specialists will guide you in choosing the best option to sell your work.
                </Text>
              </Flex>
            </Join>

            <Join separator={<Spacer my={0} />}>
              <Flex mb={0} mt={2}>
                <Text caps variant="xs">
                  find out more
                </Text>
              </Flex>
              <Flex flexDirection="column">
                <Text mb={2}>
                  For more information, see our {<Text underline> Collector Help Center</Text>}
                </Text>
                <Text>
                  Or get in touch with one of our specialists at
                  {<Text underline> consign@artsymail.com.</Text>}
                </Text>
              </Flex>
            </Join>
          </Join>
        </Box>
      </Box>
    </ScrollView>
  )
}
