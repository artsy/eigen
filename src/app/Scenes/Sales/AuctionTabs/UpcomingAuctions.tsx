import { UpcomingAuctions_viewer$key } from "__generated__/UpcomingAuctions_viewer.graphql"
import { UpcomingAuctionsRefetchQuery } from "__generated__/UpcomingAuctionsRefetchQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import React from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { AuctionTabContent } from "./AuctionTabContent"

interface UpcomingAuctionsProps {
  sales: UpcomingAuctions_viewer$key | null
}
export const UpcomingAuctions: React.FC<UpcomingAuctionsProps> = ({ sales }) => {
  const { data, loadNext, hasNext, isLoadingNext, isLoadingPrevious, refetch } =
    usePaginationFragment<UpcomingAuctionsRefetchQuery, UpcomingAuctions_viewer$key>(
      currentSalesFragment,
      sales
    )

  const nodes = extractNodes(data?.sales)

  return (
    <AuctionTabContent
      zeroStateTitle="Upcoming Auctions"
      zeroStateSubtitle="There are no upcoming auctions scheduled. Check back soon for new auctions on Artsy."
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
  fragment UpcomingAuctions_viewer on Viewer
  @argumentDefinitions(first: { type: "Int", defaultValue: 10 }, after: { type: "String" })
  @refetchable(queryName: "UpcomingAuctionsRefetchQuery") {
    sales: salesConnection(
      first: $first
      after: $after
      sort: START_AT_ASC
      auctionState: UPCOMING
    ) @connection(key: "UpcomingAuctions_sales") {
      edges {
        node {
          ...SaleListItem_sale
        }
      }
    }
  }
`
