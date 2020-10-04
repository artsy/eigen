import { Sale_me } from "__generated__/Sale_me.graphql"
import { Sale_sale } from "__generated__/Sale_sale.graphql"
import { SaleQueryRendererQuery } from "__generated__/SaleQueryRendererQuery.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { extractNodes } from "lib/utils/extractNodes"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Schema } from "lib/utils/track"
import { Flex } from "palette"
import React, { useRef, useState } from "react"
import { Animated } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { RegisterToBidButton } from "./Components/RegisterToBidButton"
// import { SaleArtworksRailContainer as SaleArtworksRail } from "./Components/SaleArtworksRail"
import { SaleHeaderContainer as SaleHeader } from "./Components/SaleHeader"
import { SaleLotsListContainer as SaleLotsList } from "./Components/SaleLotsList"

interface Props {
  sale: Sale_sale
  me: Sale_me
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

const Sale: React.FC<Props> = (props) => {
  const tracking = useTracking()

  const [isArtworksGridVisible, setArtworksGridVisible] = useState(false)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const saleArtworks = extractNodes(props.sale.saleArtworksConnection)

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
      context_screen_owner_id: props.sale.internalID,
      context_screen_owner_slug: props.sale.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    setFilterArtworkModalVisible(true)
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen: Schema.PageNames.Auction,
      context_screen_owner_id: props.sale.internalID,
      context_screen_owner_slug: props.sale.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    setFilterArtworkModalVisible(false)
  }

  const saleSectionsData: SaleSection[] = [
    {
      key: "header",
      content: <SaleHeader sale={props.sale} scrollAnim={scrollAnim} />,
    },
    {
      key: "registerToBid",
      content: (
        <Flex mx="2" mt={2}>
          <RegisterToBidButton sale={props.sale} />
        </Flex>
      ),
    },
    // {
    //   key: "saleArtworksRail",
    //   content: <SaleArtworksRail saleArtworks={saleArtworks} />,
    // },
    {
      key: "saleLotsList",
      content: <SaleLotsList sale={props.sale} />,
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
              id={props.sale.internalID}
              slug={props.sale.slug}
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

export const SaleContainer = createFragmentContainer(Sale, {
  sale: graphql`
    fragment Sale_sale on Sale {
      internalID
      slug
      ...SaleHeader_sale
      ...RegisterToBidButton_sale
      ...SaleLotsList_sale
    }
  `,
})

const Placeholder = () => <Spinner style={{ flex: 1 }} />

export const SaleQueryRenderer: React.FC<{ saleID: string }> = ({ saleID }) => {
  return (
    <QueryRenderer<SaleQueryRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SaleQueryRendererQuery($saleID: String!) {
          sale(id: $saleID) {
            ...Sale_sale
          }
        }
      `}
      variables={{ saleID }}
      render={renderWithPlaceholder({ Container: SaleContainer, renderPlaceholder: Placeholder })}
    />
  )
}
