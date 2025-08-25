import { renderHookWithWrappers } from "../renderHookWithWrappers"
import { useState } from "react"

describe("renderHookWithWrappers", () => {
  it("should render a hook with TestProviders", () => {
    const { result } = renderHookWithWrappers(() => {
      const [count, setCount] = useState(0)
      return { count, setCount }
    })

    expect(result.current.count).toBe(0)
    expect(typeof result.current.setCount).toBe("function")
  })

  it("should pass through wrapperProps to TestProviders", () => {
    const { result } = renderHookWithWrappers(
      () => {
        const [count, setCount] = useState(0)
        return { count, setCount }
      },
      {
        wrapperProps: {
          includeNavigation: true,
          includeArtworkLists: true,
          skipRelay: true,
        },
      }
    )

    expect(result.current.count).toBe(0)
  })

  it("should support hook rerenders and pass updated props", () => {
    const { result, rerender } = renderHookWithWrappers(
      ({ multiplier = 1 }: { multiplier?: number }) => {
        const [count, setCount] = useState(5)
        return { count, setCount, result: count * multiplier }
      },
      {
        initialProps: { multiplier: 2 },
      }
    )

    expect(result.current.count).toBe(5)
    expect(result.current.result).toBe(10) // 5 * 2

    rerender({ multiplier: 3 })
    expect(result.current.count).toBe(5) // useState keeps same value
    expect(result.current.result).toBe(15) // 5 * 3 (updated multiplier)
  })
})
