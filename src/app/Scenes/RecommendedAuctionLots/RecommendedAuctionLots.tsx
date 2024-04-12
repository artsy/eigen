import { OwnerType } from "@artsy/cohesion"
import {
  Flex,
  FullWidthIcon,
  GridIcon,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import {
  NewWorksForYouArtworksQR,
  PAGE_SIZE,
} from "app/Scenes/NewWorksForYou/Components/NewWorksForYouArtworks"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { MotiPressable } from "moti/interactions"
import { LayoutAnimation } from "react-native"
import { isTablet } from "react-native-device-info"

export const SCREEN_TITLE = "Auction Lots for You"

const ICON_SIZE = 26

export const RecommendedAuctionLotsQueryRenderer: React.FC = () => {
  const defaultVariables = recommendedAuctionLotsDefaultVariables()
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const setDefaultViewOption = GlobalStore.actions.userPrefs.setDefaultViewOption

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.lotsByArtistsYouFollow })}
    >
      <Screen>
        <Screen.AnimatedHeader
          onBack={goBack}
          title={SCREEN_TITLE}
          rightElements={
            !isTablet() ? (
              <MotiPressable
                onPress={() => {
                  setDefaultViewOption(defaultViewOption === "list" ? "grid" : "list")
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                }}
              >
                {defaultViewOption === "grid" ? (
                  <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} top="2px" />
                ) : (
                  <GridIcon height={ICON_SIZE} width={ICON_SIZE} top="2px" />
                )}
              </MotiPressable>
            ) : undefined
          }
        />
        <Screen.StickySubHeader title={SCREEN_TITLE} />
        <Screen.Body fullwidth>
          <NewWorksForYouArtworksQR
            maxWorksPerArtist={defaultVariables.maxWorksPerArtist}
            onlyAtAuction
          />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const recommendedAuctionLotsDefaultVariables = () => ({
  maxWorksPerArtist: 3,
  count: PAGE_SIZE,
  includeBackfill: true,
  onlyAtAuction: true,
})

export const RecommendedAuctionLotsPlaceholder: React.FC<{ defaultViewOption?: ViewOption }> = ({
  defaultViewOption,
}) => {
  const storeViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const viewOption = defaultViewOption ?? storeViewOption

  return (
    <Skeleton>
      <Flex flexDirection="row">
        <Flex my={2} px={2}>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <SkeletonText variant="xs" mt={1}>
              XX Artworks
            </SkeletonText>
          </Flex>
        </Flex>
      </Flex>
      <Spacer y={2} />
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
    </Skeleton>
  )
}
