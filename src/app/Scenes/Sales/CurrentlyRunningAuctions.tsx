import { Box, Flex } from "@artsy/palette-mobile"
import { CurrentlyRunningAuctionsRefetchQuery } from "__generated__/CurrentlyRunningAuctionsRefetchQuery.graphql"
import { CurrentlyRunningAuctions_viewer$key } from "__generated__/CurrentlyRunningAuctions_viewer.graphql"

import { extractNodes } from "app/utils/extractNodes"
import React from "react"
import { graphql, useRefetchableFragment } from "react-relay"
import { SaleList } from "./Components/SaleList"

interface CurrentlyRunningAuctionsProps {
  sales: CurrentlyRunningAuctions_viewer$key | null | undefined
}
export const CurrentlyRunningAuctions: React.FC<CurrentlyRunningAuctionsProps> = ({ sales }) => {
  const [data] = useRefetchableFragment<
    CurrentlyRunningAuctionsRefetchQuery,
    CurrentlyRunningAuctions_viewer$key
  >(currentSalesFragment, sales)

  const nodes = extractNodes(data?.sales)
  const liveAuctions = nodes.filter((a) => !!a.live_start_at)
  const timedAuctions = nodes.filter((a) => !a.live_start_at)

  return (
    <Flex>
      {!!liveAuctions.length && <SaleList title="Current Live Auctions" sales={liveAuctions} />}
      {!!liveAuctions.length && !!timedAuctions.length && <Box pb={4} />}
      {!!timedAuctions.length && <SaleList title="Current Timed Auctions" sales={timedAuctions} />}
    </Flex>
  )
}

export const currentSalesFragment = graphql`
  fragment CurrentlyRunningAuctions_viewer on Viewer
  @refetchable(queryName: "CurrentlyRunningAuctionsRefetchQuery") {
    sales: salesConnection(
      live: true
      isAuction: true
      first: 100
      sort: TIMELY_AT_NAME_ASC
      auctionState: OPEN
    ) {
      edges {
        node {
          ...SaleListItem_sale
          live_start_at: liveStartAt
        }
      }
    }
  }
`
