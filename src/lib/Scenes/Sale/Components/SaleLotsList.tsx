import { SaleLotsList_me } from "__generated__/SaleLotsList_me.graphql"
import LotsByFollowedArtists from "lib/Scenes/Sales/Components/LotsByFollowedArtists"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Flex } from "palette"
import React, { useContext } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { SaleArtworkListContainer as SaleArtworkList } from "./SaleArtworkList"

interface Props {
  me: SaleLotsList_me
}

export const SaleLotsList: React.FC<Props> = ({ me }) => {
  const filters = useContext(ArtworkFilterContext)
  const showList = filters.state.appliedFilters.find((filter) => filter.paramValue === ViewAsValues.List)

  return (
    <Flex flex={1} my={3}>
      {!showList ? (
        <LotsByFollowedArtists title="" me={me} showLotLabel hideUrgencyTags />
      ) : (
        <SaleArtworkList me={me} />
      )}
    </Flex>
  )
}

export const SaleLotsListContainer = createFragmentContainer(SaleLotsList, {
  me: graphql`
    fragment SaleLotsList_me on Me {
      ...LotsByFollowedArtists_me
      ...SaleArtworkList_me
    }
  `,
})
