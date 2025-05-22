import { Box, Flex } from "@artsy/palette-mobile"
import { CurrentlyRunningAuctionsRefetchQuery } from "__generated__/CurrentlyRunningAuctionsRefetchQuery.graphql"
import { CurrentlyRunningAuctions_viewer$key } from "__generated__/CurrentlyRunningAuctions_viewer.graphql"

import { extractNodes } from "app/utils/extractNodes"
import React, { useEffect } from "react"
import { graphql, RefetchFnDynamic, useRefetchableFragment } from "react-relay"
import { Options } from "react-relay/relay-hooks/useRefetchableFragmentNode"
import { SaleList } from "./Components/SaleList"

export type CurrentlyRunningAuctionsRefetchType = RefetchFnDynamic<
  CurrentlyRunningAuctionsRefetchQuery,
  CurrentlyRunningAuctions_viewer$key,
  Options
>

interface CurrentlyRunningAuctionsProps {
  sales: CurrentlyRunningAuctions_viewer$key | null | undefined
  setRefetchPropOnParent: (refetchProp: CurrentlyRunningAuctionsRefetchType) => void
  setSalesCountOnParent: (count: number) => void
}
export const CurrentlyRunningAuctions: React.FC<CurrentlyRunningAuctionsProps> = ({
  sales,
  setRefetchPropOnParent,
  setSalesCountOnParent,
}) => {
  const [data, refetch] = useRefetchableFragment<
    CurrentlyRunningAuctionsRefetchQuery,
    CurrentlyRunningAuctions_viewer$key
  >(currentSalesFragment, sales)

  const nodes = extractNodes(data?.sales)
  const liveAuctions = nodes.filter((a) => !!a.live_start_at)
  const timedAuctions = nodes.filter((a) => !a.live_start_at)

  useEffect(() => {
    setRefetchPropOnParent(refetch)
  }, [])

  useEffect(() => {
    setSalesCountOnParent(nodes.length)
  }, [nodes])

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
