import { SaleLotsList_me } from "__generated__/SaleLotsList_me.graphql"
import { SaleLotsList_sale } from "__generated__/SaleLotsList_sale.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import LotsByFollowedArtists from "lib/Scenes/Sales/Components/LotsByFollowedArtists"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Flex } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { SaleArtworkListContainer as SaleArtworkList } from "./SaleArtworkList"

interface Props {
  me: SaleLotsList_me
  showGrid: boolean
  sale: SaleLotsList_sale
}

export const SaleLotsList: React.FC<Props> = ({ me, showGrid, sale }) => {
  const [isArtworksGridVisible, setArtworksGridVisible] = useState(false)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  return (
    <ArtworkFilterGlobalStateProvider>
      <ArtworkFilterContext.Consumer>
        {(context) => (
          <Flex flex={1} my={3}>
            {showGrid ? (
              <LotsByFollowedArtists title="" me={me} showLotLabel hideUrgencyTags />
            ) : (
              <SaleArtworkList me={me} />
            )}
            <FilterModalNavigator
              // {...props}
              isFilterArtworksModalVisible={isFilterArtworksModalVisible}
              id={sale.internalID}
              slug={sale.slug}
              mode={FilterModalMode.SaleArtworks}
              exitModal={() => setFilterArtworkModalVisible(false)}
              closeModal={() => setFilterArtworkModalVisible(false)}
            />
            <Flex position="absolute" top={-1000} height={500} width={500}>
              <AnimatedArtworkFilterButton
                isVisible={isArtworksGridVisible}
                count={context.state.appliedFilters.length}
                onPress={() => setFilterArtworkModalVisible(true)}
              />
            </Flex>
          </Flex>
        )}
      </ArtworkFilterContext.Consumer>
    </ArtworkFilterGlobalStateProvider>
  )
}

export const SaleLotsListContainer = createFragmentContainer(SaleLotsList, {
  me: graphql`
    fragment SaleLotsList_me on Me {
      ...LotsByFollowedArtists_me
      ...SaleArtworkList_me
    }
  `,
  sale: graphql`
    fragment SaleLotsList_sale on Sale {
      internalID
      slug
    }
  `,
})
