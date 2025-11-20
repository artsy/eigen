import { UpcomingAuctionsRefetchQuery } from "__generated__/UpcomingAuctionsRefetchQuery.graphql"
import { UpcomingAuctions_viewer$key } from "__generated__/UpcomingAuctions_viewer.graphql"
import { extractNodes } from "app/utils/extractNodes"
import React, { useEffect } from "react"
import { graphql, useRefetchableFragment } from "react-relay"
import { SaleList } from "./Components/SaleList"

interface UpcomingAuctionsProps {
  sales: UpcomingAuctions_viewer$key | null | undefined
  setSalesCountOnParent: (count: number) => void
}
export const UpcomingAuctions: React.FC<UpcomingAuctionsProps> = ({
  sales,
  setSalesCountOnParent,
}) => {
  const [data] = useRefetchableFragment<UpcomingAuctionsRefetchQuery, UpcomingAuctions_viewer$key>(
    upcomingSalesFragment,
    sales
  )

  const nodes = extractNodes(data?.sales)

  useEffect(() => {
    setSalesCountOnParent(nodes.length)
  }, [nodes.length, setSalesCountOnParent])

  return <SaleList title="Upcoming Auctions" sales={nodes} />
}

export const upcomingSalesFragment = graphql`
  fragment UpcomingAuctions_viewer on Viewer
  @refetchable(queryName: "UpcomingAuctionsRefetchQuery") {
    sales: salesConnection(
      isAuction: true
      first: 10
      sort: TIMELY_AT_NAME_ASC
      auctionState: UPCOMING
    ) {
      edges {
        node {
          ...SaleListItem_sale
        }
      }
    }
  }
`
