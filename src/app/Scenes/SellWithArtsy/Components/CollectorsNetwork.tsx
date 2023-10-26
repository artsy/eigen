import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { Image } from "react-native"
import { isTablet } from "react-native-device-info"

export const CollectorsNetwork: React.FC = () => {
  if (isTablet()) {
    return (
      <Flex mx={2}>
        <Text variant="lg-display" mb={2}>
          Reach a global network of collectors
        </Text>
        <Flex flexDirection="row" alignItems="center">
          <Flex>
            <Flex mb={2}>
              <Text variant="xl">3M+</Text>
              <Text variant="xs">registered buyers worldwide</Text>
            </Flex>
            <Flex mb={2}>
              <Text variant="xl">3,000</Text>
              <Text variant="xs">miles average transaction distance</Text>
            </Flex>
            <Flex mb={2}>
              <Text variant="xl">190</Text>
              <Text variant="xs">countries</Text>
            </Flex>
          </Flex>
          <Image
            source={require("images/world-map.webp")}
            style={{ width: "70%", height: "100%" }}
            resizeMode="contain"
          />
        </Flex>
      </Flex>
    )
  }
  return (
    <Flex mx={2}>
      <Text variant="lg-display" mb={2}>
        Reach a global network of collectors
      </Text>
      <Flex>
        <Text variant="xl">3M+</Text>
        <Text variant="xs">registered buyers worldwide</Text>
      </Flex>
      <Spacer y={2} />
      <Flex flexDirection="row" mb={2}>
        <Flex maxWidth="60%">
          <Text variant="xl">3,000</Text>
          <Text variant="xs">miles average transaction distance</Text>
        </Flex>
        <Spacer x={2} />
        <Flex>
          <Text variant="xl">190</Text>
          <Text variant="xs">countries</Text>
        </Flex>
      </Flex>
      <Image
        source={require("images/world-map.webp")}
        style={{ width: "100%" }}
        resizeMode="contain"
      />
    </Flex>
  )
}
