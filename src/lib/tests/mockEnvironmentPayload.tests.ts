import _, { without } from "lodash"
import { _test_DefaultMockResolvers, _test_massageForRelay } from "./mockEnvironmentPayload"

describe("massageForRelay", () => {
  it("works for old tests", () => {
    const input = {
      Me: () => ({
        lotStandings: [],
      }),
    }

    const expected: Record<string, any> = {
      Me: () => ({
        lotStandings: [],
      }),
    }

    const output = _test_massageForRelay(input)

    expect(Object.keys(output)).toStrictEqual(Object.keys(expected))

    without(Object.keys(expected), ...Object.keys(_test_DefaultMockResolvers)).forEach((key) => {
      expect(output[key]).not.toBe(undefined)
      expect(output[key]).toBeFunction()
    })
  })

  it("works for default resolvers", () => {
    const input = {
      ..._test_DefaultMockResolvers,
    }

    const expected: Record<string, any> = {
      ID: (ctx: any) => ctx,
      String: (ctx: any) => ctx,
    }

    const output = _test_massageForRelay(input)

    expect(Object.keys(output)).toStrictEqual(Object.keys(expected))

    Object.keys(_test_DefaultMockResolvers).forEach((key) => {
      expect(output[key]).not.toBe(undefined)
      expect(output[key]).toBeFunction()
    })
  })

  it("makes nice data", () => {
    const input = {
      me: {
        lotStandings: [],
      },
    }

    const expected: Record<string, any> = {
      Me: () => ({
        lotStandings: [],
      }),
    }

    const output = _test_massageForRelay(input)

    expect(Object.keys(output)).toStrictEqual(Object.keys(expected))

    without(Object.keys(expected), ...Object.keys(_test_DefaultMockResolvers)).forEach((key) => {
      expect(output[key]).not.toBe(undefined)
      expect(output[key]).toBeFunction()
    })
  })
})
