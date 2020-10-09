import { captureMessage } from "@sentry/react-native"
import { SaleQueryRendererQuery, SaleQueryRendererQueryResponse } from "__generated__/SaleQueryRendererQuery.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import LoadFailureView from "lib/Components/LoadFailureView"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Schema } from "lib/utils/track"
import { Flex } from "palette"
import React, { useRef, useState } from "react"
import { Animated } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { RegisterToBidButton } from "./Components/RegisterToBidButton"
import { SaleArtworksRailContainer } from "./Components/SaleArtworksRail"
import { SaleHeaderContainer as SaleHeader } from "./Components/SaleHeader"
import { SaleLotsListContainer } from "./Components/SaleLotsList"

interface Props {
  queryRes: SaleQueryRendererQueryResponse
}

interface SaleSection {
  key: string
  content: JSX.Element
}

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

const Sale: React.FC<Props> = ({ queryRes }) => {
  console.log("----")
  console.log(queryRes)
  const { saleArtworksConnection } = queryRes
  const sale = queryRes.sale!
  const me = queryRes.me!
  const tracking = useTracking()

  const [isArtworksGridVisible, setArtworksGridVisible] = useState(false)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const scrollAnim = useRef(new Animated.Value(0)).current
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

  const saleSectionsData: SaleSection[] = [
    {
      key: "header",
      content: <SaleHeader sale={sale} scrollAnim={scrollAnim} />,
    },
    {
      key: "registerToBid",
      content: (
        <Flex mx="2" mt={2}>
          <RegisterToBidButton sale={sale} />
        </Flex>
      ),
    },
    {
      key: "saleArtworksRail",
      content: <SaleArtworksRailContainer me={me} />,
    },
    {
      key: "saleLotsList",
      content: <SaleLotsListContainer saleArtworksConnection={queryRes} saleID={sale.slug} />,
    },
  ]

  return (
    <ArtworkFilterGlobalStateProvider>
      <ArtworkFilterContext.Consumer>
        {(context) => (
          <>
            <Animated.FlatList
              data={saleSectionsData}
              initialNumToRender={2}
              viewabilityConfig={viewConfigRef.current}
              onViewableItemsChanged={viewableItemsChangedRef.current}
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
            <AnimatedArtworkFilterButton
              isVisible={isArtworksGridVisible}
              count={context.state.appliedFilters.length}
              onPress={openFilterArtworksModal}
            />
          </>
        )}
      </ArtworkFilterContext.Consumer>
    </ArtworkFilterGlobalStateProvider>
  )
}

export const SaleQueryRenderer: React.FC<{ saleID: string }> = ({ saleID }) => {
  return (
    <QueryRenderer<SaleQueryRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SaleQueryRendererQuery($saleID: String!) {
          sale(id: $saleID) {
            internalID
            slug
            ...SaleHeader_sale
            ...RegisterToBidButton_sale
          }
          me {
            ...SaleArtworksRail_me
          }

          ...SaleLotsList_saleArtworksConnection
        }
      `}
      variables={{ saleID }}
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
        return <Sale queryRes={props} />
      }}

      // render={renderWithPlaceholder({ Container: SaleContainer, renderPlaceholder: Placeholder })}
    />
  )
}
