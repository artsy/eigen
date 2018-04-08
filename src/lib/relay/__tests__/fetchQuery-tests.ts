jest.mock("../../NativeModules/GraphQLQueryCache")
import * as _cache from "../../NativeModules/GraphQLQueryCache"

type Mockify<T> = { [P in keyof T]: jest.MockInstance<T[P]> }

const cache: Mockify<typeof _cache> = _cache as any

jest.mock("../../metaphysics", () => ({
  request: jest.fn(),
}))
import { request as _request } from "../../metaphysics"

import { fetchQuery } from "../fetchQuery"

describe("fetchQuery", () => {
  const metaphysicsMock: jest.MockInstance<typeof _request> = _request as any

  const operation = {
    id: "SomeQueryID",
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
    cache.clear.mockClear()
    cache.clearAll.mockClear()
    cache.get.mockClear()
    cache.set.mockClear()
    metaphysicsMock.mockReset()
  })

  describe("without cached data", () => {
    beforeEach(() => {
      cache.get.mockImplementation(() => Promise.resolve(null))
      metaphysicsMock.mockImplementation(() => Promise.resolve({ text: () => JSON.stringify(response) }))
    })

    it("performs a fetch", async () => {
      expect(await fetchQuery(operation, variables, cacheConfig)).toEqual(response)
    })

    it("caches the fetched data", async () => {
      await fetchQuery(operation, variables, cacheConfig)
      expect(cache.set).toHaveBeenCalledWith(operation.id, variables, JSON.stringify(response))
    })
  })

  describe("with cached data", () => {
    it("does not perform a fetch by default", async () => {
      cache.get.mockImplementation(() => Promise.resolve(JSON.stringify(response)))
      expect(await fetchQuery(operation, variables, cacheConfig)).toEqual(response)
      expect(metaphysicsMock).not.toHaveBeenCalled()
    })

    it("does perform a fetch when forced", async () => {
      metaphysicsMock.mockImplementation(() => Promise.resolve({ text: () => JSON.stringify(response) }))
      expect(await fetchQuery(operation, variables, { force: true })).toEqual(response)
    })

    it("clears the cache after a mutation", async () => {
      metaphysicsMock.mockImplementation(() => Promise.resolve({ text: () => JSON.stringify(response) }))
      await fetchQuery({ id: "SomeMutation", operationKind: "mutation" }, variables, cacheConfig)
      expect(cache.clearAll).toHaveBeenCalled()
    })
  })
})
