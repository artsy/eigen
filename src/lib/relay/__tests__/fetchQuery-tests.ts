jest.mock("relay-runtime/lib/RelayQueryResponseCache")
import RelayQueryResponseCache from "relay-runtime/lib/RelayQueryResponseCache"

jest.mock("../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics as _metaphysics } from "../../metaphysics"

import { fetchQuery } from "../fetchQuery"

describe("fetchQuery", () => {
  const metaphysicsMock: jest.MockInstance<typeof _metaphysics> = _metaphysics as any
  const cacheMock = RelayQueryResponseCache.mock.instances[0]

  const operation = {
    text: `
      query ArtistQuery($id: ID!) {
        artist(id: $id) {
          name
        }
      }
    `,
    operationKind: "query",
  }
  const variables = {
    id: "banksy",
  }
  const cacheConfig = {
    force: false,
  }
  const response = { data: { artist: { name: "Banksy" } } }

  beforeEach(() => {
    cacheMock.clear()
    metaphysicsMock.mockReset()
  })

  describe("without cached data", () => {
    beforeEach(() => {
      metaphysicsMock.mockImplementation(() => Promise.resolve(response))
    })

    it("performs a fetch", async () => {
      expect(await fetchQuery(operation, variables, cacheConfig)).toEqual(response)
    })

    it("caches the fetched data", async () => {
      await fetchQuery(operation, variables, cacheConfig)
      expect(cacheMock.set).toHaveBeenCalledWith(operation.text, variables, response)
    })
  })

  describe("with cached data", () => {
    it("does not perform a fetch by default", async () => {
      cacheMock.get.mockImplementation(() => Promise.resolve(response))
      expect(await fetchQuery(operation, variables, cacheConfig)).toEqual(response)
      expect(metaphysicsMock).not.toHaveBeenCalled()
    })

    it("does perform a fetch when forced", async () => {
      metaphysicsMock.mockImplementation(() => Promise.resolve(response))
      expect(await fetchQuery(operation, variables, { force: true })).toEqual(response)
    })

    it("clears the cache after a mutation", async () => {
      metaphysicsMock.mockImplementation(() => Promise.resolve(response))
      await fetchQuery({ text: `mutation FollowArtist(id: ID!) {}`, operationKind: "mutation" }, variables, cacheConfig)
      expect(cacheMock.clear).toHaveBeenCalled()
    })
  })
})
