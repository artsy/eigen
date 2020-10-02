import { SaleLotsList_me } from "__generated__/SaleLotsList_me.graphql"
import { SaleLotsList_sale } from "__generated__/SaleLotsList_sale.graphql"
import LotsByFollowedArtists from "lib/Scenes/Sales/Components/LotsByFollowedArtists"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { SaleArtworkListContainer as SaleArtworkList } from "./SaleArtworkList"

interface Props {
  me: SaleLotsList_me
  showGrid: boolean
  sale: SaleLotsList_sale
}

export const SaleLotsList: React.FC<Props & ViewableItemRefs> = ({ me, showGrid }) => {
  return (
    <Flex flex={1} my={3}>
      {showGrid ? <LotsByFollowedArtists title="" me={me} showLotLabel hideUrgencyTags /> : <SaleArtworkList me={me} />}
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
