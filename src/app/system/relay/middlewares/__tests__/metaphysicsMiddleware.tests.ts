import { persistedQueryMiddleware } from "app/system/relay/middlewares/metaphysicsMiddleware"
import { GraphQLRequest } from "app/system/relay/middlewares/types"

jest.mock("../../../../../../data/complete.queryMap.json", () => ({
  "query-id": "persisted-query-text",
}))

describe("persisted queries", () => {
  describe("with a 404 response from metaphysics", () => {
    const request: GraphQLRequest = {
      operation: {
        id: "query-id",
        query: "query-text",
      } as any,
      variables: {},
      cacheConfig: {},
      fetchOpts: {} as any,
      getID() {
        return "query-id"
      },
      getVariables() {
        return {}
      },
    } as any
    beforeAll(() => {
      // @ts-ignore
      __DEV__ = false
    })
    afterAll(() => {
      // @ts-ignore
      __DEV__ = true
    })
    it(`will be retried if the query id was not recognized by MP`, async () => {
      let rejected = false
      let retried = false

      const mockedErrorsNext = (req: any) => {
        if (JSON.parse(req.fetchOpts.body).documentID) {
          rejected = true
          return Promise.reject(new Error("Unable to serve persisted query with ID"))
        } else {
          retried = true
          return Promise.resolve({
            status: 200,
            json: { data: { success: true }, errors: undefined },
          })
        }
      }
      // @ts-ignore
      await expect(persistedQueryMiddleware()(mockedErrorsNext)(request)).resolves.toMatchObject({
        json: { data: { success: true } },
      })

      expect(rejected).toBe(true)
      expect(retried).toBe(true)
    })

    it(`will be not be retried if failure was something else`, async () => {
      let rejected = false
      let retried = false

      const mockedErrorsNext = (req: any) => {
        if (JSON.parse(req.fetchOpts.body).documentID) {
          rejected = true
          return Promise.reject(new Error("something unrecognized went wrong"))
        } else {
          retried = true
          return Promise.resolve({
            status: 200,
            json: { data: { success: true }, errors: undefined },
          })
        }
      }

      await expect(persistedQueryMiddleware()(mockedErrorsNext as any)(request)).rejects.toEqual(
        new Error("something unrecognized went wrong")
      )

      expect(rejected).toBe(true)
      expect(retried).toBe(false)
    })
  })
})
