import { IResolvers } from "graphql-tools/dist/Interfaces"
import { graphql } from "react-relay"
import { Environment, fetchQuery, GraphQLTaggedNode, RecordSource, Store } from "relay-runtime"
import { createMockNetworkLayer2 } from "../index"

// Pulled from https://github.com/artsy/reaction/pull/1854
describe("createMockNetworkLayer", () => {
  function fetchQueryWithResolvers(resolvers: IResolvers, query?: GraphQLTaggedNode) {
    const network = createMockNetworkLayer2(resolvers)

    const source = new RecordSource()
    const store = new Store(source)
    const environment = new Environment({ network, store })

    return fetchQuery(
      environment,
      query ||
        graphql`
          query createMockNetworkLayerTestsQuery {
            artwork(id: "untitled") {
              __id
              title
            }
          }
        `,
      {}
    )
  }

  describe("preserves the upstream behaviour", () => {
    it("returns the data if present", async () => {
      const data = await fetchQueryWithResolvers({
        artwork: { title: "Untitled", __id: "untitled" },
      })
      expect(data.artwork.title).toEqual("Untitled")
    })

    it("returns null for nullable fields which are given as null", async () => {
      const data = await fetchQueryWithResolvers({
        artwork: { title: null, __id: "null" },
      })
      expect(data.artwork.title).toEqual(null)
    })

    it("converts undefined to null", async () => {
      const data = await fetchQueryWithResolvers({
        artwork: { title: undefined, __id: "null" },
      })
      expect(data.artwork.title).toEqual(null)
    })
  })

  it("complains with a helpful error when selected field is not present", async () => {
    try {
      await fetchQueryWithResolvers({ artwork: { __id: "blah" } })
    } catch (e) {
      expect(e.message).toMatchInlineSnapshot(
        `"RelayMockNetworkLayerError: A mock for field at path 'artwork/title' of type 'String' was expected but not found."`
      )
    }
  })

  it("uses data provided with an aliased name", async () => {
    const data = await fetchQueryWithResolvers(
      {
        artist: {
          forSaleArtworks: [{ __id: "for-sale-work" }],
          notForSaleArtworks: [{ __id: "no-for-sale-work" }],
          __id: "id",
        },
      },
      graphql`
        query createMockNetworkLayerTestsAliasQuery {
          artist(id: "banksy") {
            forSaleArtworks: artworks(filter: IS_FOR_SALE) {
              __id
            }
            notForSaleArtworks: artworks(filter: IS_NOT_FOR_SALE) {
              __id
            }
          }
        }
      `
    )
    expect(data.artist.forSaleArtworks).toEqual([{ __id: "for-sale-work" }])
    expect(data.artist.notForSaleArtworks).toEqual([{ __id: "no-for-sale-work" }])
  })
})
