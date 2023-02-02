import { Spacer } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { Box, Flex, Text } from "palette"

export const WhySellWithArtsy: React.FC = () => {
  const handleOurSpecialistsPress = () => {
    navigate("/meet-the-specialists")
  }

  return (
    <Box px={2}>
      <Text variant="lg-display">Why sell with Artsy?</Text>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <Box pl={0.5} pr={1}>
          <Text variant="sm">01</Text>
        </Box>

        <Box flex={1}>
          <Text variant="sm">Earn more</Text>
          <Spacer mb="0.5" />
          <Text variant="sm" color="black60">
            We charge less than traditional auction houses and dealers, so you’ll net more.
          </Text>
        </Box>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <Box pl={0.5} pr={1}>
          <Text variant="sm">02</Text>
        </Box>

        <Box flex={1}>
          <Text variant="sm">Reach a global network</Text>
          <Spacer mb={0.5} />
          <Text variant="sm" color="black60">
            We connect your work with interested buyers in 190 countries.
          </Text>
        </Box>
      </Flex>

      <Spacer mb={2} />

      <Flex flexDirection="row">
        <Box pl={0.5} pr={1}>
          <Text variant="sm">03</Text>
        </Box>

        <Box flex={1}>
          <Text variant="sm">Tap into our expertise</Text>
          <Spacer mb={0.5} />
          <Text variant="sm" color="black60">
            <Text
              variant="sm"
              onPress={handleOurSpecialistsPress}
              style={{ textDecorationLine: "underline" }}
            >
              Our specialists
            </Text>{" "}
            will guide you and handle it all, from pricing to shipping.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
