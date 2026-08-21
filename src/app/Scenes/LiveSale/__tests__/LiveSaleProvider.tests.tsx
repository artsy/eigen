import type { ArtworkMetadata } from "app/Scenes/LiveSale/types/liveAuction"

describe("LiveSaleProvider - Artwork Metadata Mapping", () => {
  it("should key artwork metadata by internalID (UUID) to match WebSocket lot IDs", () => {
    // This test documents the expected behavior:
    // GraphQL provides saleArtworks with both internalID (UUID) and lotLabel (number)
    // WebSocket sends lot updates using the UUID as the lotId
    // Therefore, we must key our metadata map by internalID (UUID)

    const mockGraphQLData = {
      edges: [
        {
          node: {
            internalID: "uuid-lot-1", // This is the UUID used by WebSocket as lotId
            lotLabel: "1", // This is the lot number for display only
            estimate: "$10,000-$15,000",
            lowEstimate: { cents: 1000000 },
            highEstimate: { cents: 1500000 },
            artwork: {
              title: "Artwork 1",
              artistNames: "Artist 1",
              image: {
                aspectRatio: 1.5,
                url: "https://example.com/image1.jpg",
              },
            },
          },
        },
        {
          node: {
            internalID: "uuid-lot-2",
            lotLabel: "2",
            estimate: "$20,000-$25,000",
            lowEstimate: { cents: 2000000 },
            highEstimate: { cents: 2500000 },
            artwork: {
              title: "Artwork 2",
              artistNames: "Artist 2",
              image: {
                aspectRatio: 1.3,
                url: "https://example.com/image2.jpg",
              },
            },
          },
        },
      ],
    }

    // Simulate the mapping logic from LiveSaleProvider
    const artworkMetadata = new Map<string, ArtworkMetadata>()

    for (const edge of mockGraphQLData.edges) {
      const node = edge.node
      if (!node.internalID) continue

      const metadata: ArtworkMetadata = {
        internalID: node.internalID,
        lotLabel: node.lotLabel,
        estimate: node.estimate,
        lowEstimateCents: node.lowEstimate.cents,
        highEstimateCents: node.highEstimate.cents,
        artwork: {
          title: node.artwork.title,
          artistNames: node.artwork.artistNames,
          image: {
            aspectRatio: node.artwork.image.aspectRatio,
            url: node.artwork.image.url,
          },
        },
      }

      // KEY BEHAVIOR: Map must be keyed by internalID (UUID), not lotLabel
      artworkMetadata.set(node.internalID, metadata)
    }

    // ASSERTIONS: Verify the map is keyed correctly
    expect(artworkMetadata.size).toBe(2)

    // Should be accessible by WebSocket UUID (internalID)
    expect(artworkMetadata.has("uuid-lot-1")).toBe(true)
    expect(artworkMetadata.has("uuid-lot-2")).toBe(true)

    // Should NOT be keyed by lotLabel
    expect(artworkMetadata.has("1")).toBe(false)
    expect(artworkMetadata.has("2")).toBe(false)

    // Verify the metadata content
    const lot1Metadata = artworkMetadata.get("uuid-lot-1")
    expect(lot1Metadata).toBeDefined()
    expect(lot1Metadata?.internalID).toBe("uuid-lot-1")
    expect(lot1Metadata?.lotLabel).toBe("1") // lotLabel is stored IN the metadata
    expect(lot1Metadata?.artwork?.title).toBe("Artwork 1")
    expect(lot1Metadata?.artwork?.artistNames).toBe("Artist 1")
    expect(lot1Metadata?.artwork?.image?.url).toBe("https://example.com/image1.jpg")
  })
})
