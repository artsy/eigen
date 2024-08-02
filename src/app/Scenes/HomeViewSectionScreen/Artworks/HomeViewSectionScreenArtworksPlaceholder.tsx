import { Flex, Screen, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { PlaceholderGrid } from "app/utils/placeholderGrid"
import { times } from "lodash"

export const HomeViewSectionScreenArtworksPlaceholder: React.FC = () => {
  const viewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

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

        {viewOption === "grid" ? (
          <PlaceholderGrid />
        ) : (
          <Flex width="100%" px={2}>
            {times(4).map((i) => (
              <Flex key={i} mt={1} mb={2}>
                <Flex>
                  <SkeletonBox key={i} width="100%" height={400} />
                </Flex>
                <Spacer y={1} />
                <SkeletonText>David Hockey</SkeletonText>
                <Spacer y={0.5} />
                <SkeletonText>Mercy from the Virtues H9-13 </SkeletonText>
                <Spacer y={0.5} />
                <SkeletonText>Berg Contemporary</SkeletonText>
                <Spacer y={0.5} />
                <SkeletonText>£38,000</SkeletonText>
              </Flex>
            ))}
          </Flex>
        )}
      </Screen.ScrollView>
    </Skeleton>
  )
}
