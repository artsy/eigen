import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedMyCollectionInsightsMedianAuctionRailItem,
} from "@artsy/cohesion"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { MedianAuctionPriceRail_me$key } from "__generated__/MedianAuctionPriceRail_me.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { getVortexMedium } from "app/utils/marketPriceInsightHelpers"
import { groupBy } from "lodash"
import { Flex } from "palette"
import { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"
import { MedianAuctionPriceListItem } from "./MedianAuctionPriceListItem"

interface MedianAuctionPriceRailProps {
  me: MedianAuctionPriceRail_me$key
}

const HAS_SEEN_MEDIAN_AUCTION_PRICE_TOOLTIP = "HAS_SEEN_MEDIAN_AUCTION_PRICE_TOOLTIP"

export const MedianAuctionPriceRail: React.FC<MedianAuctionPriceRailProps> = (props) => {
  const me = useFragment(fragment, props.me)
  const artworks = extractNodes(me.priceInsightUpdates)

  const tracking = useTracking()

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation?.addListener("blur", () => {
      setHasSeenToolTip(true)
      AsyncStorage.setItem(HAS_SEEN_MEDIAN_AUCTION_PRICE_TOOLTIP, "true")
    })
    return unsubscribe
  }, [navigation])

  const [hasSeenTooltip, setHasSeenToolTip] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(HAS_SEEN_MEDIAN_AUCTION_PRICE_TOOLTIP).then((seen) => {
      if (seen === "true") {
        setHasSeenToolTip(true)
      }
    })
    return () => {
      AsyncStorage.setItem(HAS_SEEN_MEDIAN_AUCTION_PRICE_TOOLTIP, "true")
    }
  }, [])

  if (artworks.length === 0) {
    return <></>
  }

  const groupedArtworks = Object.values(groupBy(artworks, (artwork) => artwork?.artist?.name))

  return (
    <Flex mb={2}>
      <FlatList
        data={groupedArtworks}
        listKey="median-sale-prices"
        ListHeaderComponent={() => (
          <Flex mx={2}>
            <SectionTitle
              capitalized={false}
              title="Median Auction Price in the Last 3 Years"
              onPress={() => {
                const artistID = artworks[0].artist?.internalID
                const category = getVortexMedium(
                  artworks[0].medium ?? "",
                  artworks[0].mediumType?.name ?? ""
                )
                if (artistID && category) {
                  tracking.trackEvent(tracks.tappedRailItem(artistID, category))
                }
                navigate(`/my-collection/median-sale-price-at-auction/${artistID}`, {
                  passProps: {
                    initialCategory: category,
                  },
                })
              }}
              mb={2}
            />
          </Flex>
        )}
        renderItem={({ item, index }) => (
          <MedianAuctionPriceListItem
            artworks={item}
            enableToolTip={index === 0 && !hasSeenTooltip}
            onPress={(medium) => {
              setHasSeenToolTip(true)
              AsyncStorage.setItem(HAS_SEEN_MEDIAN_AUCTION_PRICE_TOOLTIP, "true")
              const artistID = item[0].artist?.internalID
              const category =
                medium || getVortexMedium(item[0].medium ?? "", item[0].mediumType?.name ?? "")
              if (artistID && category) {
                tracking.trackEvent(tracks.tappedRailItem(artistID, category))
              }
              navigate(`/my-collection/median-sale-price-at-auction/${artistID}`, {
                passProps: {
                  initialCategory: category,
                },
              })
            }}
          />
        )}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment MedianAuctionPriceRail_me on Me {
    priceInsightUpdates: myCollectionConnection(first: 3, sortByLastAuctionResultDate: true) {
      edges {
        node {
          internalID
          medium
          mediumType {
            name
          }
          title
          artist {
            internalID
            name
            imageUrl
            formattedNationalityAndBirthday
          }
          marketPriceInsights {
            medianSalePriceDisplayText
          }
        }
      }
    }
  }
`

const tracks = {
  tappedRailItem: (
    artistID: string,
    category: string
  ): TappedMyCollectionInsightsMedianAuctionRailItem => {
    return {
      action: ActionType.tappedMyCollectionInsightsMedianAuctionRailItem,
      context_module: ContextModule.myCollectionInsightsMedianAuctionRail,
      context_screen: OwnerType.myCollectionInsights,
      context_screen_owner_type: OwnerType.myCollectionInsights,
      artist_id: artistID,
      category,
    }
  },
}
