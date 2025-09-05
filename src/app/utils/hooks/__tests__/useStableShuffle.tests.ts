import { renderHook } from "@testing-library/react-native"
import { useStableShuffle } from "app/utils/hooks/useStableShuffle"

jest.mock("app/NativeModules/LegacyNativeModules", () => ({
  LegacyNativeModules: {
    ARCocoaConstantsModule: {
      LocalTimeZone: "UTC",
    },
  },
}))

describe("useStableShuffle", () => {
  // Mock Date.now() to make tests deterministic
  const originalDateNow = Date.now
  const mockedDate = new Date("2023-01-01T12:00:00Z")

  beforeAll(() => {
    Date.now = jest.fn(() => mockedDate.getTime())
  })

  afterAll(() => {
    Date.now = originalDateNow
  })

  it("should shuffle items with a provided seed", () => {
    const items = [1, 2, 3, 4, 5]
    const seed = "test-seed"

    const { result } = renderHook(() => useStableShuffle({ items, seed }))

    // Check that the result contains both shuffled array and seed
    expect(result.current).toHaveProperty("shuffled")
    expect(result.current).toHaveProperty("seed", seed)

    // Check that all items are present, in different order
    expect(result.current.shuffled).toHaveLength(items.length)
    expect(result.current.shuffled).not.toEqual(items)
  })

  it("should produce the same shuffled order for the same seed", () => {
    const items = ["apple", "banana", "cherry", "date", "elderberry"]
    const seed = "consistent-seed"

    const { result: result1 } = renderHook(() => useStableShuffle({ items, seed }))
    const { result: result2 } = renderHook(() => useStableShuffle({ items, seed }))

    // Both hooks should return the same shuffled order
    expect(result1.current.shuffled).toEqual(result2.current.shuffled)
  })

  it("should use a daily seed when no seed is provided", () => {
    const items = ["red", "green", "blue", "yellow"]

    const { result } = renderHook(() => useStableShuffle({ items }))

    // The hook should use the daily seed format (based on our mocked date)
    expect(result.current.seed).toEqual("01/01/2023")

    // Check that all items are present
    expect(result.current.shuffled).toHaveLength(items.length)
    expect(result.current.shuffled.sort()).toEqual(items.sort())
  })

  it("should produce the same shuffled order on the same day", () => {
    const items = [10, 20, 30, 40, 50]

    const { result: result1 } = renderHook(() => useStableShuffle({ items }))
    const { result: result2 } = renderHook(() => useStableShuffle({ items }))

    // Both hooks should use the same daily seed
    expect(result1.current.seed).toEqual(result2.current.seed)

    // Both hooks should produce the same shuffled order
    expect(result1.current.shuffled).toEqual(result2.current.shuffled)
  })

  it("should handle empty arrays", () => {
    const items: number[] = []

    const { result } = renderHook(() => useStableShuffle({ items }))

    // The shuffled array should also be empty
    expect(result.current.shuffled).toEqual([])
  })

  it("should memoize results for the same inputs", () => {
    const items = [1, 2, 3, 4, 5]
    const seed = "test-seed"

    const { result, rerender } = renderHook(() => useStableShuffle({ items, seed }))
    const firstResult = result.current.shuffled

    // Rerender with the same inputs
    rerender(() => {})

    // The shuffled array should be the same object (memoized)
    expect(result.current.shuffled).toBe(firstResult)
  })
})
