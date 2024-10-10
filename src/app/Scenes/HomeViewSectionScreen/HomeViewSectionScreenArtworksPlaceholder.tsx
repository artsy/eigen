import { Flex, Screen, Skeleton, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { PlaceholderList } from "app/utils/PlaceholderList"
import { PlaceholderGrid } from "app/utils/placeholderGrid"

export const HomeViewSectionScreenArtworksPlaceholder: React.FC = () => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

  return (
    <Skeleton>
      <Screen.ScrollView>
        <Flex flexDirection="row">
          <Flex px={2}>
            <SkeletonText variant="lg-display">Lorem Ipsem For You</SkeletonText>
            <Spacer y={2} />
            <SkeletonText variant="xs">XX Artworks</SkeletonText>
          </Flex>
        </Flex>

        <Spacer y={1} />

        {defaultViewOption === "grid" && <PlaceholderGrid />}
        {defaultViewOption === "list" && <PlaceholderList />}
      </Screen.ScrollView>
    </Skeleton>
  )
}
