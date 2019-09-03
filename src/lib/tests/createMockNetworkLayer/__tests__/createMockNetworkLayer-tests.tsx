import { graphql } from "react-relay"
import { Environment, fetchQuery, GraphQLTaggedNode, RecordSource, Store } from "relay-runtime"
import { createMockNetworkLayer2 } from "../index"

jest.unmock("react-relay")

describe("createMockNetworkLayer", () => {
  function fetchQueryWithData(options: Parameters<typeof createMockNetworkLayer2>[0], query?: GraphQLTaggedNode) {
    const network = createMockNetworkLayer2(options)

    const source = new RecordSource()
    const store = new Store(source)
    const environment = new Environment({ network, store })

    return fetchQuery<{ variables: {}; response: any }>(
      environment,
      query ||
        graphql`
          query createMockNetworkLayerTestsQuery {
            artwork(id: "untitled") {
              id
              title
            }
          }
        `,
      {}
    )
  }

  describe("preserves the upstream behaviour", () => {
    it("returns the data if present", async () => {
      const data = await fetchQueryWithData({
        mockData: {
          artwork: { title: "Untitled", id: "untitled" },
        },
      })
      expect(data.artwork.title).toEqual("Untitled")
    })
    it("returns null for nullable fields which are given as null", async () => {
      const data = await fetchQueryWithData({
        mockData: {
          artwork: { title: null, id: "null" },
        },
      })
      expect(data.artwork.title).toEqual(null)
    })

    it("converts undefined to null", async () => {
      const data = await fetchQueryWithData({
        mockData: {
          artwork: { title: undefined, id: "null" },
        },
      })
      expect(data.artwork.title).toEqual(null)
    })
  })

  it("complains with a helpful error when selected field is not present", async () => {
    try {
      await fetchQueryWithData({
        mockData: {
          artwork: { id: "blah" },
        },
      })
    } catch (e) {
      expect(e.message).toMatchInlineSnapshot(
        `"Could not find query, ensure operation.text exists or pass resolveQueryFromOperation."`
      )
    }
  })

  it("uses data provided with an aliased name", async () => {
    const data = await fetchQueryWithData(
      {
        mockData: {
          artist: {
            forSaleArtworks: { edges: [{ node: { id: "for-sale-work" } }] },
            notForSaleArtworks: { edges: [{ node: { id: "no-for-sale-work" } }] },
            id: "id",
          },
        },
      },
      graphql`
        query createMockNetworkLayerTestsAliasQuery {
          artist(id: "banksy") {
            forSaleArtworks: artworksConnection(filter: IS_FOR_SALE) {
              edges {
                node {
                  id
                }
              }
            }
            notForSaleArtworks: artworksConnection(filter: IS_NOT_FOR_SALE) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `
    )
    expect(data.artist.forSaleArtworks).toEqual({ edges: [{ node: { id: "for-sale-work" } }] })
    expect(data.artist.notForSaleArtworks).toEqual({ edges: [{ node: { id: "no-for-sale-work" } }] })
  })
})
