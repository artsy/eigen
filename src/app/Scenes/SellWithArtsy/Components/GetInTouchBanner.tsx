import { Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { isPad } from "app/utils/hardware"
import { Button } from "palette"
import { Image } from "react-native"

export const GetInTouchBanner: React.FC<{ onInquiryPress: () => void }> = ({ onInquiryPress }) => {
  const color = useColor()
  const isAPad = isPad()
  return (
    <Flex bg="black100" py={2}>
      <Flex mx={2} pt={1}>
        <Text variant="lg" color={color("white100")}>
          Selling multiple artworks? Get in touch to connect with a specialist.
        </Text>
        <Spacer y={4} />
        <Button variant="outline" block onPress={onInquiryPress}>
          Get in Touch
        </Button>
        <Spacer y={isAPad ? 4 : 2} />
        <Image
          source={
            isAPad
              ? require("images/get-in-touch-banner-image-ipad.png")
              : require("images/get-in-touch-banner-image.png")
          }
          style={{
            width: "100%",
            alignSelf: "center",
            // the image for ipad has too much space on the left
            right: isAPad ? 50 : undefined,
          }}
          resizeMode="contain"
        />
      </Flex>
    </Flex>
  )
}
