import { CloseIcon } from "@artsy/icons/native"
import {
  DEFAULT_HIT_SLOP,
  Flex,
  Screen,
  Skeleton,
  SkeletonText,
  Spacer,
  Spinner,
  Touchable,
} from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { PlaceholderList } from "app/utils/PlaceholderList"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { PlaceholderGrid } from "app/utils/placeholderGrid"

export const HomeViewSectionScreenArtworksPlaceholder: React.FC = () => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const enableNewHomeViewCardRailType = useFeatureFlag("AREnableNewHomeViewCardRailType")

  if (!enableNewHomeViewCardRailType) {
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

              {defaultViewOption === "grid" && <PlaceholderGrid />}
              {defaultViewOption === "list" && <PlaceholderList />}
            </Screen.ScrollView>
          </Skeleton>
        </Screen.Body>
      </Screen>
    )
  }

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Screen.Header
          rightElements={
            <Touchable
              accessibilityRole="button"
              accessibilityLabel="Exit New Works For you"
              hitSlop={DEFAULT_HIT_SLOP}
              onPress={() => goBack()}
            >
              <CloseIcon />
            </Touchable>
          }
          hideLeftElements
          title="New Works For You"
        />
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          position="absolute"
          height="100%"
          width="100%"
        >
          <Spinner />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
