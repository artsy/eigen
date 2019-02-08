jest.mock("../../../NativeModules/GraphQLQueryCache")
import * as _cache from "../../../NativeModules/GraphQLQueryCache"

type Mockify<T> = { [P in keyof T]: jest.MockInstance<T[P]> }

const cache: Mockify<typeof _cache> = _cache as any

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
  const response = { data: { artist: { name: "Banksy" } }, status: 200 }

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
