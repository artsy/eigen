import { navigate } from "app/system/navigation/navigate"
import { sendEmailWithMailTo } from "app/utils/sendEmail"
import { Box, Flex, Join, Spacer, Text } from "palette"
import { ScrollView } from "react-native"
import { useScreenDimensions } from "shared/hooks"

export const MyCollectionSellingWithArtsyFAQ: React.FC = () => {
  const { safeAreaInsets } = useScreenDimensions()
  const article = "https://support.artsy.net/hc/en-us/sections/360008311913-Sell-with-Artsy"

  return (
    <ScrollView>
      <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2}>
        <Box my={2}>
          <Join separator={<Spacer my={1} />}>
            <Text variant="lg-display" mb={2}>
              How It Works
            </Text>

            <Flex>
              <Text caps variant="xs">
                Submit your artwork
              </Text>

              <Text mb={1}>
                Submit your artwork details and images. Artsy will review and approve qualified
                submissions.
              </Text>
            </Flex>

            <Flex>
              <Text caps variant="xs">
                Receive multiple offers
              </Text>

              <Text mb={1}>
                If your work is accepted, you’ll receive competitive offers from Artsy’s curated
                auctions, auction houses, and galleries.
              </Text>
            </Flex>

            <Flex>
              <Text caps variant="xs">
                Match and sell
              </Text>

              <Text mb={1}>
                Our specialists will guide you in choosing the best option to sell your work.
              </Text>
            </Flex>

            <Flex>
              <Text caps variant="xs">
                find out more
              </Text>

              <Text mb={2}>
                For more information, see our{" "}
                <Text underline onPress={() => navigate(article)}>
                  Collector Help Center
                </Text>
              </Text>

              <Text>
                Or get in touch with one of our specialists at{" "}
                <Text underline onPress={() => sendEmailWithMailTo("mailto:sell@artsy.net")}>
                  sell@artsy.net
                </Text>
                {"."}
              </Text>
            </Flex>
          </Join>
        </Box>
      </Box>
    </ScrollView>
  )
}
