import { BoxProps, Flex, Text } from "@artsy/palette-mobile"
import { TextVariant } from "@artsy/palette-tokens/dist/typography/v3"

export interface PartnerBannerProps extends BoxProps {
  textVariant?: TextVariant
  bannerText: string
}

export const PartnerBanner: React.FC<PartnerBannerProps> = ({ bannerText, textVariant = "xs" }) => {
  return (
    <Flex flexDirection="row" justifyContent="space-around" bg="black10" py={0.5}>
      <Text variant={textVariant} color="black100">
        •
      </Text>
      <Text variant={textVariant} color="black100">
        {bannerText}
      </Text>
      <Text variant={textVariant} color="black100">
        •
      </Text>
      <Text variant={textVariant} color="black100">
        {bannerText}
      </Text>
      <Text variant={textVariant} color="black100">
        •
      </Text>
    </Flex>
  )
}
