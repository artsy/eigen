import { SaleLotsList_me } from "__generated__/SaleLotsList_me.graphql"
import LotsByFollowedArtists from "lib/Scenes/Sales/Components/LotsByFollowedArtists"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { SaleArtworkListContainer as SaleArtworkList } from "./SaleArtworkList"

interface Props {
  me: SaleLotsList_me
  showGrid: boolean
}

export const SaleLotsList: React.FC<Props> = ({ me, showGrid }) => {
  return (
    <Flex my={3}>
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
