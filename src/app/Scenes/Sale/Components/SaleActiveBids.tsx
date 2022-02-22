import { SaleActiveBids_me } from "__generated__/SaleActiveBids_me.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Flex, Separator } from "palette"
import React from "react"
import { FlatList, LayoutAnimation } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import useInterval from "react-use/lib/useInterval"
import { SaleActiveBidItemContainer } from "./SaleActiveBidItem"

interface SaleActiveBidsProps {
  me: SaleActiveBids_me
  saleID: string
  relay: RelayRefetchProp
}

export const SaleActiveBids: React.FC<SaleActiveBidsProps> = ({ me, relay, saleID }) => {
  // Constantly update the list of lots standing every 5 seconds
  useInterval(() => {
    // Animate the way new lots show up
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    relay.refetch(
      { saleID },
      null,
      () => {
        // Do nothing
      },
      { force: true }
    )
  }, 5000)

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

export const SaleActiveBidsContainer = createRefetchContainer(
  SaleActiveBids,
  {
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
  },
  graphql`
    query SaleActiveBidsRefetchQuery($saleID: String!) {
      me {
        ...SaleActiveBids_me @arguments(saleID: $saleID)
      }
    }
  `
)
