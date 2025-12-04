import { UpcomingAuctionsRefetchQuery } from "__generated__/UpcomingAuctionsRefetchQuery.graphql"
import { UpcomingAuctions_viewer$key } from "__generated__/UpcomingAuctions_viewer.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useRefetchableFragment } from "react-relay"
import { SaleList } from "./Components/SaleList"

interface UpcomingAuctionsProps {
  sales: UpcomingAuctions_viewer$key | null | undefined
}
export const UpcomingAuctions: React.FC<UpcomingAuctionsProps> = ({ sales }) => {
  const [data] = useRefetchableFragment<UpcomingAuctionsRefetchQuery, UpcomingAuctions_viewer$key>(
    upcomingSalesFragment,
    sales
  )

  const nodes = extractNodes(data?.sales)

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
