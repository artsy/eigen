import { LiveSaleProviderQuery } from "__generated__/LiveSaleProviderQuery.graphql"
import React, { createContext, useMemo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import {
  useLiveAuctionWebSocket,
  type LiveAuctionWebSocketReturn,
} from "./hooks/useLiveAuctionWebSocket"
import type { ArtworkMetadata, BidderCredentials } from "./types/liveAuction"

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

  // Build artwork metadata map from GraphQL data
  const artworkMetadata = useMemo(() => {
    const map = new Map<string, ArtworkMetadata>()

    const edges = data.sale?.saleArtworksConnection?.edges ?? []

    for (const edge of edges) {
      const node = edge?.node
      if (!node?.lotLabel) continue

      const metadata: ArtworkMetadata = {
        internalID: node.internalID,
        lotLabel: node.lotLabel,
        estimate: node.estimate ?? null,
        lowEstimateCents: node.lowEstimate?.cents ?? null,
        highEstimateCents: node.highEstimate?.cents ?? null,
        artwork: node.artwork
          ? {
              title: node.artwork.title ?? null,
              artistNames: node.artwork.artistNames ?? null,
              image: node.artwork.image
                ? {
                    aspectRatio: node.artwork.image.aspectRatio,
                    url: node.artwork.image.url ?? "",
                  }
                : null,
            }
          : null,
      }

      map.set(node.lotLabel, metadata)
    }

    return map
  }, [data.sale?.saleArtworksConnection?.edges])

  // Initialize WebSocket connection
  const wsState = useLiveAuctionWebSocket({
    jwt: data.system.causalityJWT,
    saleID: data.sale.internalID,
    saleName: data.sale.name ?? "Live Auction",
    credentials,
    artworkMetadata,
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
      saleArtworksConnection(all: true) {
        edges {
          node {
            internalID
            lotLabel
            estimate
            lowEstimate {
              cents
            }
            highEstimate {
              cents
            }
            artwork {
              title
              artistNames
              image {
                aspectRatio
                url(version: "large")
              }
            }
          }
        }
      }
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
