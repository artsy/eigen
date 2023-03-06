import { Flex, Text } from "@artsy/palette-mobile"
import { isPad } from "app/utils/hardware"
import { Image } from "react-native"

export const CollectorsNetwork: React.FC = () => {
  const isAPad = isPad()
  if (isAPad) {
    return (
      <Flex mx={2}>
        <Text variant="lg-display" mb={2}>
          Reach a global network of collectors
        </Text>
        <Flex flexDirection="row" alignItems="center">
          <Flex>
            <Flex mb={2}>
              <Text variant="xl">2.5 M</Text>
              <Text variant="sm-display">Art lovers</Text>
            </Flex>
            <Flex mb={2}>
              <Text variant="xl">4000+</Text>
              <Text variant="sm-display">Auction houses and Galleries</Text>
            </Flex>
            <Flex mb={2}>
              <Text variant="xl">90</Text>
              <Text variant="sm-display">Countries</Text>
            </Flex>
          </Flex>
          <Image
            source={require("images/world-map.png")}
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
      <Flex flexDirection="row">
        <Flex width="50%">
          <Text variant="xl">2.5 M</Text>
          <Text variant="sm-display">Art lovers</Text>
        </Flex>
        <Flex width="50%">
          <Text variant="xl">4000+</Text>
          <Text variant="sm-display">Auction houses and Galleries</Text>
        </Flex>
      </Flex>
      <Flex flexDirection="row" mb={2}>
        <Flex width="50%">
          <Text variant="xl">90</Text>
          <Text variant="sm-display">Countries</Text>
        </Flex>
      </Flex>
      <Image
        source={require("images/world-map.png")}
        style={{ width: "100%" }}
        resizeMode="contain"
      />
    </Flex>
  )
}
