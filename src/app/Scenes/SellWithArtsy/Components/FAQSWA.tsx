import { Button, Flex, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { isPad } from "app/utils/hardware"
import { Image } from "react-native"

export const FAQSWA: React.FC = () => {
  const supportUrl = "https://support.artsy.net/hc/en-us/categories/360003689533-Sell"
  const isTablet = isPad()
  const image = Image.resolveAssetSource(require("images/swa-faq-image.png"))
  const aspectRatio = image.width / image.height
  return (
    <Flex
      pt={4}
      px={2}
      pb={2}
      backgroundColor="black100"
      flexDirection={isTablet ? "row" : "column"}
    >
      <Flex>
        <Text variant="md" mb={4} color="white100">
          No upfront fees, clear pricing estimates and commission structures.
        </Text>
        <Text variant="xs" color="white100" mb={2}>
          Have more questions?
        </Text>
        <Button
          block={!isTablet}
          minWidth={isTablet ? "50%" : undefined}
          onPress={() => {
            navigate(supportUrl)
          }}
          variant="outlineLight"
          mb={2}
        >
          Read FAQs
        </Button>
      </Flex>
      <Flex>
        <Image
          source={image}
          // we need to explicitly pass aspectRatio to be able to fit this image properly on large screens
          style={{ width: "100%", height: 200, aspectRatio: isTablet ? aspectRatio : undefined }}
          resizeMode="cover"
        ></Image>
      </Flex>
    </Flex>
  )
}
