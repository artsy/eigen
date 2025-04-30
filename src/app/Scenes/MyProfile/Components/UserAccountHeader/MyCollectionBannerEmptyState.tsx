import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Image } from "react-native"

export const MyCollectionBannerEmptyState: React.FC = () => {
  return (
    <RouterLink to="my-collection" testID="my-collection-banner-empty-state">
      <Flex width="100%" flexDirection="row" p={1} backgroundColor="mono5" borderRadius={10}>
        <Join separator={<Spacer x={1} />}>
          <Flex flex={1} flexDirection="column" justifyContent="center">
            <Text>Build Your Collection</Text>
            <Text color="mono60">Manage, track, and gain insights into your art collection. </Text>
          </Flex>
          <Image
            source={require("images/user_account_mc_empty_state.webp")}
            resizeMode="contain"
            height={80}
            width={80}
          />
        </Join>
      </Flex>
    </RouterLink>
  )
}
