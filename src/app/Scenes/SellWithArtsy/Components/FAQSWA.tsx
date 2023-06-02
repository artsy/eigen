import { Flex, Text, Button } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { isPad } from "app/utils/hardware"
import { useScreenDimensions } from "app/utils/hooks"
import { Image } from "react-native"

export const FAQSWA: React.FC = () => {
  const supportUrl = "https://support.artsy.net/s/topic/0TO3b000000UesxGAC/sell"
  const isTablet = isPad()
  const { width: deviceWidth } = useScreenDimensions()
  return (
    <Flex pt={4} backgroundColor="black100" maxWidth={deviceWidth}>
      <Flex mx={2} mt={2} mb={4}>
        <Text variant="lg" mb={4} color="white100">
          No upfront fees, clear pricing estimates, and competitive commission structures.
        </Text>
        <Text variant="xs" color="white100" mb={2}>
          Have more questions?
        </Text>
        <Button
          block
          onPress={() => {
            navigate(supportUrl)
          }}
          variant="outlineLight"
          mb={2}
        >
          Read FAQs
        </Button>
      </Flex>
      <Image
        source={require("images/swa-faq-image.webp")}
        style={{ width: "100%", height: isTablet ? 480 : 200 }}
        resizeMode="cover"
      />
    </Flex>
  )
}
