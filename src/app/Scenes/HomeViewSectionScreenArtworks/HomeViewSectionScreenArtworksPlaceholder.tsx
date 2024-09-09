import { Flex, Screen, Skeleton, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"
import { PlaceholderGrid } from "app/utils/placeholderGrid"

export const HomeViewSectionScreenArtworksPlaceholder: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="" />
      <Screen.Body fullwidth>
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

            <PlaceholderGrid />
          </Screen.ScrollView>
        </Skeleton>
      </Screen.Body>
    </Screen>
  )
}
