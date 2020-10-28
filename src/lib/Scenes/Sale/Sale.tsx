import { captureMessage } from "@sentry/react-native"
import { Sale_me } from "__generated__/Sale_me.graphql"
import { Sale_sale } from "__generated__/Sale_sale.graphql"
import { SaleQueryRendererQuery, SaleQueryRendererQueryResponse } from "__generated__/SaleQueryRendererQuery.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import LoadFailureView from "lib/Components/LoadFailureView"
import Spinner from "lib/Components/Spinner"
import { navigate, popParentViewController } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { getCurrentEmissionState } from "lib/store/AppStore"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Schema } from "lib/utils/track"
import { useInterval } from "lib/utils/useInterval"
import { usePrevious } from "lib/utils/usePrevious"
import _ from "lodash"
import moment from "moment"
import { Flex } from "palette"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Animated, FlatList, RefreshControl } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import { RegisterToBidButtonContainer } from "./Components/RegisterToBidButton"
import { SaleActiveBidsContainer } from "./Components/SaleActiveBids"
import { SaleArtworksRailContainer } from "./Components/SaleArtworksRail"
import { SaleHeaderContainer as SaleHeader } from "./Components/SaleHeader"
import { SaleLotsListContainer } from "./Components/SaleLotsList"

interface Props {
  queryRes: SaleQueryRendererQueryResponse
  sale: Sale_sale
  me: Sale_me
  relay: RelayRefetchProp
}

interface SaleSection {
  key: string
  content: JSX.Element
}

const SALE_HEADER = "header"
const SALE_REGISTER_TO_BID = "registerToBid"
const SALE_ACTIVE_BIDS = "saleActiveBids"
const SALE_ARTWORKS_RAIL = "saleArtworksRail"
const SALE_LOTS_LIST = "saleLotsList"

// Types related to showing filter button on scroll
export interface ViewableItems {
  viewableItems?: ViewToken[]
}

interface ViewToken {
  item?: SaleSection
  key?: string
  index?: number | null
  isViewable?: boolean
  section?: any
}

export const Sale: React.FC<Props> = ({ sale, me, queryRes, relay }) => {
  const flatListRef = useRef<FlatList<any>>(null)

  const tracking = useTracking()

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isArtworksGridVisible, setArtworksGridVisible] = useState(false)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const prevIsLive = usePrevious(isLive, false)

  const scrollAnim = useRef(new Animated.Value(0)).current

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetch(() => {
      setIsRefreshing(false)
    })
  }, [])

  // poll every .5 seconds to check if sale has gone live
  useInterval(() => {
    if (sale.liveStartAt === null) {
      setIsLive(false)
      return
    }
    const now = moment()
    if (now.isAfter(sale.liveStartAt)) {
      if (sale.endAt === null) {
        setIsLive(true)
        return
      }
      if (now.isBefore(sale.endAt)) {
        setIsLive(true)
        return
      }
      setIsLive(false)
      return
    }
    setIsLive(false)
    return
  }, 500)

  useEffect(() => {
    if (isLive === true && prevIsLive === false) {
      switchToLive()
    }
  }, [isLive, prevIsLive])

  const switchToLive = () => {
    const liveBaseURL = getCurrentEmissionState().predictionURL
    const liveAuctionURL = `${liveBaseURL}/${sale.slug}`
    navigate(liveAuctionURL)
    setTimeout(popParentViewController, 500)
  }

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 })
  const viewableItemsChangedRef = React.useRef(({ viewableItems }: ViewableItems) => {
    const artworksItem = (viewableItems! ?? []).find((viewableItem: ViewToken) => {
      return viewableItem?.item?.key === "saleLotsList"
    })
    setArtworksGridVisible(artworksItem?.isViewable ?? false)
  })

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen: Schema.PageNames.Auction,
      context_screen_owner_id: sale.internalID,
      context_screen_owner_slug: sale.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    setFilterArtworkModalVisible(true)
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen: Schema.PageNames.Auction,
      context_screen_owner_id: sale.internalID,
      context_screen_owner_slug: sale.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    setFilterArtworkModalVisible(false)
  }

  const scrollToTop = () => {
    const saleLotsListIndex = saleSectionsData.findIndex((section) => section.key === SALE_LOTS_LIST)
    flatListRef.current?.scrollToIndex({ index: saleLotsListIndex, viewOffset: 50 })
  }

  const saleSectionsData: SaleSection[] = _.compact([
    {
      key: SALE_HEADER,
      content: <SaleHeader sale={sale} scrollAnim={scrollAnim} />,
    },
    (sale.endAt === null || moment().isBefore(sale.endAt)) &&
      sale.registrationEndsAt !== null &&
      moment().isBefore(sale.registrationEndsAt) && {
        key: SALE_REGISTER_TO_BID,
        content: (
          <Flex mx="2" mt={2}>
            <RegisterToBidButtonContainer sale={sale} me={me} contextType="sale" />
          </Flex>
        ),
      },
    {
      key: SALE_ACTIVE_BIDS,
      content: <SaleActiveBidsContainer me={me} saleID={sale.internalID} />,
    },
    {
      key: SALE_ARTWORKS_RAIL,
      content: <SaleArtworksRailContainer me={me} />,
    },
    {
      key: SALE_LOTS_LIST,
      content: (
        <SaleLotsListContainer
          saleArtworksConnection={queryRes}
          saleID={sale.slug}
          saleSlug={sale.slug}
          scrollToTop={scrollToTop}
        />
      ),
    },
  ])

  return (
    <ArtworkFilterGlobalStateProvider>
      <ArtworkFilterContext.Consumer>
        {() => (
          <>
            <Animated.FlatList
              ref={flatListRef}
              data={saleSectionsData}
              initialNumToRender={4} // Render the infinite scroll list after the rest of the page
              viewabilityConfig={viewConfigRef.current}
              onViewableItemsChanged={viewableItemsChangedRef.current}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item }: { item: SaleSection }) => item.content}
              keyExtractor={(item: SaleSection) => item.key}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: { y: scrollAnim },
                    },
                  },
                ],
                {
                  useNativeDriver: true,
                }
              )}
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
              scrollEventThrottle={16}
            />
            <FilterModalNavigator
              isFilterArtworksModalVisible={isFilterArtworksModalVisible}
              id={sale.internalID}
              slug={sale.slug}
              mode={FilterModalMode.SaleArtworks}
              exitModal={closeFilterArtworksModal}
              closeModal={closeFilterArtworksModal}
            />
            <AnimatedArtworkFilterButton isVisible={isArtworksGridVisible} onPress={openFilterArtworksModal} />
          </>
        )}
      </ArtworkFilterContext.Consumer>
    </ArtworkFilterGlobalStateProvider>
  )
}

export const SaleContainer = createRefetchContainer(
  Sale,
  {
    me: graphql`
      fragment Sale_me on Me {
        ...SaleArtworksRail_me @arguments(saleID: $saleSlug)
        ...SaleActiveBids_me @arguments(saleID: $saleID)
        ...RegisterToBidButton_me @arguments(saleID: $saleID)
      }
    `,
    sale: graphql`
      fragment Sale_sale on Sale {
        internalID
        slug
        liveStartAt
        endAt
        ...SaleHeader_sale
        ...RegisterToBidButton_sale
        registrationEndsAt
      }
    `,
  },
  graphql`
    query SaleRefetchQuery($saleID: String!, $saleSlug: ID!) {
      me {
        ...Sale_me
      }
      sale(id: $saleID) {
        ...Sale_sale
      }
    }
  `
)

export const SaleQueryRenderer: React.FC<{ saleID: string }> = ({ saleID }) => {
  return (
    <QueryRenderer<SaleQueryRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SaleQueryRendererQuery($saleID: String!, $saleSlug: ID!) {
          sale(id: $saleID) {
            ...Sale_sale
          }
          me {
            ...Sale_me
          }

          ...SaleLotsList_saleArtworksConnection @arguments(saleID: $saleSlug)
        }
      `}
      variables={{ saleID, saleSlug: saleID }}
      render={({ props, error }) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error.stack!)
          }
          return <LoadFailureView style={{ flex: 1 }} />
        }

        if (!props?.me || !props?.sale) {
          return (
            <Flex alignItems="center" justifyContent="center" flex={1}>
              <Spinner />
            </Flex>
          )
        }

        return <SaleContainer queryRes={props} me={props.me} sale={props.sale} />
      }}
    />
  )
}
