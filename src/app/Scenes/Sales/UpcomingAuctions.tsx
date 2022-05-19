import { UpcomingAuctions_viewer$key } from "__generated__/UpcomingAuctions_viewer.graphql"
import { UpcomingAuctionsRefetchQuery } from "__generated__/UpcomingAuctionsRefetchQuery.graphql"
import { Stack } from "app/Components/Stack"
import { extractNodes } from "app/utils/extractNodes"
import React, { useEffect } from "react"
import { graphql, RefetchFnDynamic, useRefetchableFragment } from "react-relay"
import { Options } from "react-relay/relay-hooks/useRefetchableFragmentNode"
import { SaleList } from "./Components/SaleList"

export type UpcomingAuctionsRefetchType = RefetchFnDynamic<
  UpcomingAuctionsRefetchQuery,
  UpcomingAuctions_viewer$key,
  Options
>

interface UpcomingAuctionsProps {
  sales: UpcomingAuctions_viewer$key | null
  setRefetchPropOnParent: (refetchProp: UpcomingAuctionsRefetchType) => void
  setSalesCountOnParent: (count: number) => void
}
export const UpcomingAuctions: React.FC<UpcomingAuctionsProps> = ({
  sales,
  setRefetchPropOnParent,
  setSalesCountOnParent,
}) => {
  const [data, refetch] = useRefetchableFragment<
    UpcomingAuctionsRefetchQuery,
    UpcomingAuctions_viewer$key
  >(upcomingSalesFragment, sales)

  const nodes = extractNodes(data?.sales)

  useEffect(() => {
    setRefetchPropOnParent(refetch)
  }, [])

  useEffect(() => {
    setSalesCountOnParent(nodes.length)
  }, [nodes.length])

  return (
    <Stack py={2} spacing={3}>
      <SaleList title="Upcoming Auctions" sales={nodes} />
    </Stack>
  )
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
