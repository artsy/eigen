import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Image } from "react-native"

export const MyCollectionBannerEmptyState: React.FC = () => {
  return (
    <Flex width="100%">
      <RouterLink to="my-collection" testID="my-collection-banner-empty-state">
        <Flex flexDirection="row" p={1} backgroundColor="mono5" borderRadius={10}>
          <Flex flex={1}>
            <Flex flexDirection="column" justifyContent="center">
              <Text variant="xs">Build Your Collection</Text>
              <Text color="mono60" variant="xs">
                Manage, track, and gain insights into your art collection.{" "}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent="flex-end" width={91}>
            <Image
              source={require("images/user_account_mc_empty_state.webp")}
              resizeMode="contain"
              style={{
                height: 80,
              }}
            />
          </Flex>
        </Flex>
      </RouterLink>
    </Flex>
  )
}
