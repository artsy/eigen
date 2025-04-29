import { Flex, Join, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"

export const MyCollectionBannerEmptyState: React.FC = () => {
  return (
    <Touchable onPress={() => navigate("my-collection")}>
      <Flex width="100%" flexDirection="row" p={1} backgroundColor="mono5" borderRadius={10}>
        <Join separator={<Spacer x={1} />}>
          <Flex flex={1} flexDirection="column">
            <Text>Build Your Collection</Text>
            <Text color="mono60">Manage, track, and gain insights into your art collection. </Text>
          </Flex>
          <Flex height={80} width={80} backgroundColor="pink"></Flex>
        </Join>
      </Flex>
    </Touchable>
  )
}
