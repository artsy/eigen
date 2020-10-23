import { SaleActiveBids_me } from "__generated__/SaleActiveBids_me.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Flex, Separator } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { SaleActiveBidItemContainer } from "./SaleActiveBidItem"

interface SaleActiveBidsProps {
  me: SaleActiveBids_me
  saleID: string
}

export const SaleActiveBids: React.FC<SaleActiveBidsProps> = ({ me }) => {
  if (!me.lotStandings?.length) {
    return null
  }

  return (
    <Flex px={2} mt={3}>
      <FlatList
        data={me.lotStandings}
        ListHeaderComponent={() => <SectionTitle title="Your active bids" />}
        ItemSeparatorComponent={() => <Separator my={0.5} />}
        renderItem={({ item }) => <SaleActiveBidItemContainer lotStanding={item!} />}
        keyExtractor={(item) => item!.saleArtwork!.slug}
      />
    </Flex>
  )
}

export const SaleActiveBidsContainer = createFragmentContainer(SaleActiveBids, {
  me: graphql`
    fragment SaleActiveBids_me on Me @argumentDefinitions(saleID: { type: "String" }) {
      lotStandings(saleID: $saleID) {
        ...SaleActiveBidItem_lotStanding
        saleArtwork {
          slug
        }
      }
    }
  `,
})
