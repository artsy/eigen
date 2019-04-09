jest.mock("../../../NativeModules/GraphQLQueryCache")
import * as _cache from "../../../NativeModules/GraphQLQueryCache"

const cache: jest.Mocked<typeof _cache> = _cache as any

import { NetworkError } from "lib/utils/errors"
import { cacheMiddleware } from "../cacheMiddleware"

describe("cacheMiddleware", () => {
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
  const request = {
    operation,
    variables,
    cacheConfig,
  }
  const response = { json: { artist: { name: "Banksy" } }, status: 200, statusText: "OK" }

  beforeEach(() => {
    cache.clear.mockClear()
    cache.clearAll.mockClear()
    cache.get.mockClear()
    cache.set.mockClear()
  })

  const mockedNext = () => {
    return new Promise(resolve => {
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
      const data = await cacheMiddleware()(mockedNext)(request)
      expect(data).toEqual(response)
    })

    it("caches the fetched data", async () => {
      await cacheMiddleware()(mockedNext)(request)

      expect(cache.set.mock.calls.length).toEqual(2)
      expect(cache.set.mock.calls[0][0]).toEqual(operation.id)
    })

    describe("a response with errors", () => {
      it("clears the cache and throws an error", async () => {
        const mockedErrorsNext = () => {
          return new Promise(resolve => {
            resolve({
              ...response,
              json: {
                ...response.json,
                errors: [{ errorCode: 1234 }],
              },
            })
          })
        }

        await expect(cacheMiddleware()(mockedErrorsNext)(request)).rejects.toEqual(new NetworkError("OK"))

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
        return new Promise(resolve => {
          resolve({
            status: 500,
            statusText: "some weird 500 HTML page or something",
          })
        })
      }

      await expect(cacheMiddleware()(mockedErrorsNext)(request)).rejects.toEqual(
        new NetworkError("some weird 500 HTML page or something")
      )

      // 1 cache call means we set request as in-flight.
      expect(cache.set).toHaveBeenCalledTimes(1)
      expect(cache.set).toHaveBeenCalledWith(operation.id, variables, null)

      expect(cache.clear).toHaveBeenCalledWith(operation.id, variables)
    })
  })

  describe("with cached data", () => {
    it("does not perform a fetch by default", async () => {
      cache.get.mockImplementation(() => Promise.resolve(JSON.stringify(response)))
      expect(await cacheMiddleware()(mockedNext)(request)).toEqual(response)
    })

    it("does perform a fetch when forced", async () => {
      const aRequest = {
        operation,
        variables,
        cacheConfig: { force: true },
      }
      expect(await cacheMiddleware()(mockedNext)(aRequest)).toEqual(response)
    })

    it("clears the cache after a mutation", async () => {
      const bRequest = {
        operation: { id: "SomeMutation", operationKind: "mutation" },
        variables,
        cacheConfig,
      }
      await cacheMiddleware()(mockedNext)(bRequest)
      expect(cache.clearAll).toHaveBeenCalled()
    })
  })
})
