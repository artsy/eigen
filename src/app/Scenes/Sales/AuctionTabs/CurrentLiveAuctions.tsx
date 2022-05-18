import { CurrentLiveAuctions_viewer$key } from "__generated__/CurrentLiveAuctions_viewer.graphql"
import { CurrentLiveAuctionsRefetchQuery } from "__generated__/CurrentLiveAuctionsRefetchQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import React from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { AuctionTabContent } from "./AuctionTabContent"

interface CurrentLiveAuctionsProps {
  sales: CurrentLiveAuctions_viewer$key | null
}
export const CurrentLiveAuctions: React.FC<CurrentLiveAuctionsProps> = ({ sales }) => {
  const { data, loadNext, hasNext, isLoadingNext, isLoadingPrevious, refetch } =
    usePaginationFragment<CurrentLiveAuctionsRefetchQuery, CurrentLiveAuctions_viewer$key>(
      currentSalesFragment,
      sales
    )

  const nodes = extractNodes(data?.sales)

  return (
    <AuctionTabContent
      zeroStateTitle="Current Live Auctions"
      zeroStateSubtitle="There are no current live auctions. Check back soon for new auctions on Artsy."
      data={nodes}
      loadNext={loadNext}
      hasNext={hasNext}
      isLoadingNext={isLoadingNext}
      isLoadingPrevious={isLoadingPrevious}
      refetch={refetch}
    />
  )
}

export const currentSalesFragment = graphql`
  fragment CurrentLiveAuctions_viewer on Viewer
  @argumentDefinitions(first: { type: "Int", defaultValue: 10 }, after: { type: "String" })
  @refetchable(queryName: "CurrentLiveAuctionsRefetchQuery") {
    sales: salesConnection(
      first: $first
      after: $after
      live: true
      published: true
      sort: LICENSED_TIMELY_AT_NAME_DESC
      auctionState: OPEN
    ) @connection(key: "CurrentLiveAuctions_sales") {
      edges {
        node {
          ...SaleListItem_sale
        }
      }
    }
  }
`
