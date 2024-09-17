import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import {
  SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$data,
  SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$key,
} from "__generated__/SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection.graphql"
import { ArtworkRailProps } from "app/Components/ArtworkRail/ArtworkRail"
import { ArtworkRailCard, ArtworkRailCardProps } from "app/Components/ArtworkRail/ArtworkRailCard"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const MAX_NUMBER_OF_ARTWORKS = 30

interface SellWithArtsyRecentlySoldProps {
  recentlySoldArtworks: SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$key
}

const trackingArgs: TappedEntityGroupArgs = {
  contextModule: ContextModule.artworkRecentlySoldGrid,
  contextScreenOwnerType: OwnerType.sell,
  destinationScreenOwnerType: OwnerType.artwork,
  type: "thumbnail",
}

export const SellWithArtsyRecentlySold: React.FC<SellWithArtsyRecentlySoldProps> = ({
  recentlySoldArtworks,
}) => {
  const tracking = useTracking()
  const recentlySoldArtworksData = useFragment(
    customRecentlySoldArtworksFragment,
    recentlySoldArtworks
  )

  const recentlySoldArtworksNodes = extractNodes(recentlySoldArtworksData)

  return (
    <Flex>
      <Text px={2} variant="lg-display">
        Previously sold on Artsy
      </Text>

      <Spacer y={2} />

      <RecentlySoldArtworksRail
        recentlySoldArtworks={recentlySoldArtworksNodes}
        onPress={(recentlySoldArtwork) => {
          if (recentlySoldArtwork?.artwork?.href) {
            tracking.trackEvent(
              tappedEntityGroup({
                ...trackingArgs,
                destinationScreenOwnerId: recentlySoldArtwork?.artwork?.internalID,
                destinationScreenOwnerSlug: recentlySoldArtwork?.artwork?.slug,
              })
            )
            navigate(recentlySoldArtwork.artwork.href)
          }
        }}
        showPartnerName={false}
      />
    </Flex>
  )
}

type RecentlySoldArtwork = NonNullable<
  NonNullable<SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$data["edges"]>[0]
>["node"]

export interface RecentlySoldArtworksRailProps
  extends Omit<ArtworkRailProps, "artworks" | "onPress"> {
  recentlySoldArtworks: RecentlySoldArtwork[]
  onPress?: (recentlySoldArtwork: RecentlySoldArtwork, index: number) => void
}

const RecentlySoldArtworksRail: React.FC<RecentlySoldArtworksRailProps> = ({
  listRef,
  onPress,
  onEndReached,
  onEndReachedThreshold,
  ListHeaderComponent = <Spacer x={2} />,
  ListFooterComponent = <Spacer x={2} />,
  hideArtistName = false,
  recentlySoldArtworks,
  showPartnerName = true,
}) => {
  return (
    <PrefetchFlatList
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      prefetchUrlExtractor={(item) => item?.artwork?.href || undefined}
      listRef={listRef}
      horizontal
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={() => <Spacer x="15px" />}
      showsHorizontalScrollIndicator={false}
      // We need to set the maximum number of artworks to not cause layout shifts
      data={recentlySoldArtworks.slice(0, MAX_NUMBER_OF_ARTWORKS)}
      initialNumToRender={MAX_NUMBER_OF_ARTWORKS}
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => {
        if (!item?.artwork) {
          return null
        }

        return (
          <ArtworkRailCard
            artwork={item.artwork}
            onPress={() => {
              onPress?.(item, index)
            }}
            priceRealizedDisplay={item?.priceRealized?.display || ""}
            lowEstimateDisplay={item?.lowEstimate?.display || ""}
            highEstimateDisplay={item?.highEstimate?.display || ""}
            performanceDisplay={item?.performance?.mid ?? undefined}
            showPartnerName={showPartnerName}
            CustomSalePriceComponent={
              <RecentlySoldCardSection
                priceRealizedDisplay={item?.priceRealized?.display || ""}
                lowEstimateDisplay={item?.lowEstimate?.display || ""}
                highEstimateDisplay={item?.highEstimate?.display || ""}
                performanceDisplay={item?.performance?.mid ?? undefined}
              />
            }
            displayRealizedPrice
            hideArtistName={hideArtistName}
          />
        )
      }}
      keyExtractor={(item, index) => String(item?.artwork?.slug || index)}
    />
  )
}

const RecentlySoldCardSection: React.FC<
  Pick<
    ArtworkRailCardProps,
    "priceRealizedDisplay" | "lowEstimateDisplay" | "highEstimateDisplay" | "performanceDisplay"
  >
> = ({ priceRealizedDisplay, lowEstimateDisplay, highEstimateDisplay, performanceDisplay }) => {
  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between" mt={1}>
        <Text variant="lg-display" numberOfLines={1}>
          {priceRealizedDisplay}
        </Text>
        {!!performanceDisplay && (
          <Text variant="lg-display" color="green" numberOfLines={1}>
            {`+${performanceDisplay}`}
          </Text>
        )}
      </Flex>
      <Text variant="xs" color="black60" lineHeight="20px">
        Estimate {compact([lowEstimateDisplay, highEstimateDisplay]).join("—")}
      </Text>
    </Flex>
  )
}

const customRecentlySoldArtworksFragment = graphql`
  fragment SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection on RecentlySoldArtworkTypeConnection {
    edges {
      node {
        artwork {
          ...ArtworkRailCard_artwork @arguments(width: 250)
          internalID
          href
          slug
        }
        lowEstimate {
          display
        }
        highEstimate {
          display
        }
        priceRealized {
          display
        }
        performance {
          mid
        }
      }
    }
  }
`
