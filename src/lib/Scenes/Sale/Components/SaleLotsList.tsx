import { SaleLotsList_me } from "__generated__/SaleLotsList_me.graphql"
import LotsByFollowedArtists from "lib/Scenes/Sales/Components/LotsByFollowedArtists"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  me: SaleLotsList_me
}

export const SaleLotsList: React.FC<Props> = ({ me }) => {
  return (
    <Flex mt={3}>
      <LotsByFollowedArtists title={"Lots by Artists You Follow"} me={me} showLotLabel />
    </Flex>
  )
}

export const SaleLotsListContainer = createFragmentContainer(SaleLotsList, {
  me: graphql`
    fragment SaleLotsList_me on Me {
      ...LotsByFollowedArtists_me
    }
  `,
})
