import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { NewWorksForYouArtworksQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouArtworks"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
export const SCREEN_TITLE = "New Works for You"
export const PAGE_SIZE = 100
export const RECOMMENDATION_MODEL_EXPERIMENT_NAME = "eigen-new-works-for-you-recommendations-model"
export const DEFAULT_RECS_MODEL_VERSION = "C"

export interface RecommendedAuctionLotsScreenProps {
  maxWorksPerArtist: number
}

interface RecommendedAuctionLotsQueryRendererProps {
  maxWorksPerArtist?: number
}

export const RecommendedAuctionLotsQueryRenderer: React.FC<
  RecommendedAuctionLotsQueryRendererProps
> = ({ maxWorksPerArtist = 3 }) => {
  // Use the version specified in the URL or no version if the screen is opened from the email.

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
    >
      <Screen>
        <Screen.AnimatedHeader onBack={goBack} title="Auction Lots for You" />
        <Screen.StickySubHeader title="Auction Lots for You" />
        <Screen.Body fullwidth>
          <NewWorksForYouArtworksQR maxWorksPerArtist={maxWorksPerArtist} onlyAtAuction />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

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
