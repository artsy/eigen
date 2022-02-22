jest.mock("app/relay/RelayCache")
import { RelayCache as _cache } from "app/relay/RelayCache"
import { GraphQLRequest } from "./types"

const cache: jest.Mocked<typeof _cache> = _cache as any

import { cacheMiddleware } from "./cacheMiddleware"

describe("cacheMiddleware", () => {
  const operation = {
    id: "SomeQueryID",
    operationKind: "query",
    name: "SomeQueryName",
    text: null,
    metadata: {},
  }
  const variables = {
    id: "banksy",
  }
  const cacheConfig = {
    force: false,
  }
  const request: GraphQLRequest = {
    // @ts-ignore
    operation,
    variables,
    cacheConfig,
    // @ts-ignore
    fetchOpts: {},
  }
  const response = { json: { artist: { name: "Banksy" } }, status: 200, statusText: "OK" }

  beforeEach(() => {
    cache.clear.mockClear()
    cache.clearAll.mockClear()
    cache.get.mockClear()
    cache.set.mockClear()
  })

  const mockedNext = () => {
    return new Promise((resolve) => {
      resolve(response)
    })
  }

  describe("without cached data", () => {
    beforeEach(() => {
      cache.get.mockImplementation(() => {
        return Promise.resolve(null)
      })
    })

    it("performs a fetch", async () => {
      // @ts-ignore
      const data = await cacheMiddleware()(mockedNext)(request)
      expect(data).toEqual(response)
    })

    it("caches the fetched data", async () => {
      // @ts-ignore
      await cacheMiddleware()(mockedNext)(request)

      expect(cache.set.mock.calls.length).toEqual(2)
      expect(cache.set.mock.calls[0][0]).toEqual(operation.id)
    })

    describe("a response with errors", () => {
      it("clears the cache", async () => {
        const mockedErrorsNext = () => {
          return new Promise((resolve) => {
            resolve({
              ...response,
              json: {
                ...response.json,
                errors: [{ errorCode: 1234 }],
              },
            })
          })
        }

        // @ts-ignore
        await cacheMiddleware()(mockedErrorsNext)(request)

        // 1 cache call means we set request as in-flight.
        expect(cache.set).toHaveBeenCalledTimes(1)
        expect(cache.set).toHaveBeenCalledWith(operation.id, variables, null)

        expect(cache.clear).toHaveBeenCalledWith(operation.id, variables)
      })
    })
  })

  describe("a 500 response from metaphysics", () => {
    it("clears the cache and throws an error", async () => {
      const mockedErrorsNext = () => {
        return new Promise((resolve) => {
          resolve({
            status: 500,
            statusText: "some weird 500 HTML page or something",
          })
        })
      }

      // @ts-ignore
      await cacheMiddleware()(mockedErrorsNext)(request)

      // 1 cache call means we set request as in-flight.
      expect(cache.set).toHaveBeenCalledTimes(1)
      expect(cache.set).toHaveBeenCalledWith(operation.id, variables, null)

      expect(cache.clear).toHaveBeenCalledWith(operation.id, variables)
    })
  })

  describe("with cached data", () => {
    it("does not perform a fetch by default", async () => {
      cache.get.mockImplementation(() => Promise.resolve(JSON.stringify(response)))
      // @ts-ignore
      expect(await cacheMiddleware()(mockedNext)(request)).toEqual(response)
    })

    it("does perform a fetch when forced", async () => {
      const aRequest: GraphQLRequest = {
        // @ts-ignore
        operation,
        variables,
        cacheConfig: { force: true },
        // @ts-ignore
        fetchOpts: {},
      }
      // @ts-ignore
      expect(await cacheMiddleware()(mockedNext)(aRequest)).toEqual(response)
    })

    it("clears the cache after a mutation", async () => {
      const mutation: GraphQLRequest = {
        // @ts-ignore
        operation: {
          id: "SomeMutationID",
          operationKind: "mutation",
          text: null,
          metadata: {},
          name: "SomeMutationName",
        },
        variables,
        cacheConfig,
        // @ts-ignore
        fetchOpts: {},
      }
      // @ts-ignore
      await cacheMiddleware()(mockedNext)(mutation)
      expect(cache.clearAll).toHaveBeenCalled()
    })

    it("ignores clearing the cache for allowed mutations", async () => {
      const mutation: GraphQLRequest = {
        // @ts-ignore
        operation: {
          id: "ArtworkMarkAsRecentlyViewedQueryID",
          operationKind: "mutation",
          text: null,
          metadata: {},
          name: "ArtworkMarkAsRecentlyViewedQuery",
        },
        variables,
        cacheConfig,
        // @ts-ignore
        fetchOpts: {},
      }
      // @ts-ignore
      await cacheMiddleware()(mockedNext)(mutation)
      expect(cache.clearAll).not.toHaveBeenCalled()
    })
  })
})
