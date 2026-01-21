import { LiveSaleProviderQuery } from "__generated__/LiveSaleProviderQuery.graphql"
import React, { createContext } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import {
  useLiveAuctionWebSocket,
  type LiveAuctionWebSocketReturn,
} from "./hooks/useLiveAuctionWebSocket"
import type { BidderCredentials } from "./types/liveAuction"

// ==================== Context ====================

export const LiveAuctionContext = createContext<LiveAuctionWebSocketReturn | null>(null)

// ==================== Provider ====================

interface LiveSaleProviderProps {
  slug: string
  children: React.ReactNode
}

export const LiveSaleProvider: React.FC<LiveSaleProviderProps> = ({ slug, children }) => {
  // Fetch static data from GraphQL
  const data = useLazyLoadQuery<LiveSaleProviderQuery>(
    liveSaleProviderQuery,
    { saleID: slug },
    {
      fetchPolicy: "network-only",
    }
  )

  // This shouldn't happen as the query would fail, but TypeScript needs it
  if (!data.sale) {
    throw new Error("Sale not found")
  }

  if (!data.system?.causalityJWT) {
    throw new Error("Causality JWT not available")
  }

  // Prepare bidder credentials
  const credentials: BidderCredentials = {
    bidderId: data.me?.bidders?.[0]?.internalID ?? "",
    paddleNumber: data.me?.paddleNumber ?? "",
  }

  // Initialize WebSocket connection
  const wsState = useLiveAuctionWebSocket({
    jwt: data.system.causalityJWT,
    saleID: data.sale.internalID,
    saleName: data.sale.name ?? "Live Auction",
    credentials,
  })

  return <LiveAuctionContext.Provider value={wsState}>{children}</LiveAuctionContext.Provider>
}

// ==================== GraphQL Query ====================

const liveSaleProviderQuery = graphql`
  query LiveSaleProviderQuery($saleID: String!) {
    sale(id: $saleID) {
      name
      internalID
      startAt
    }
    system {
      causalityJWT(saleID: $saleID, role: PARTICIPANT)
    }
    me {
      internalID
      paddleNumber
      bidders(saleID: $saleID) {
        internalID
      }
    }
  }
`
