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

  it("should support hook rerenders", () => {
    const { result, rerender } = renderHookWithWrappers(
      ({ initialValue = 0 }: { initialValue?: number }) => {
        const [count, setCount] = useState(initialValue)
        return { count, setCount }
      },
      {
        initialProps: { initialValue: 5 },
      }
    )

    expect(result.current.count).toBe(5)

    rerender({ initialValue: 10 })
    expect(result.current.count).toBe(5) // useState keeps initial value
  })
})
