import { Button, Flex, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { Image } from "react-native"

export const FAQSWA: React.FC = () => {
  const supportUrl = "https://support.artsy.net/hc/en-us/categories/360003689533-Sell"

  return (
    <Flex pt={4} px={2} pb={2} backgroundColor="black100">
      <Flex maxWidth="80%">
        <Text variant="md" mb={4} color="white100">
          No upfront fees, clear pricing estimates and commission structures.
        </Text>
        <Text variant="xs" color="white100" mb={2}>
          Have more questions?
        </Text>
      </Flex>

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
      <Image
        source={require("images/swa-faq-image.png")}
        style={{ width: "100%", height: 200 }}
        resizeMode="contain"
      />
    </Flex>
  )
}
