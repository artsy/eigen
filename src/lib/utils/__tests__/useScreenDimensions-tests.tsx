import { renderHook } from "@testing-library/react-hooks"
import { useScreenDimensions, ProvideScreenDimensions } from "../useScreenDimensions"
import React from "react"

describe(useScreenDimensions, () => {
  const wrapper: React.FC = ({ children }) => <ProvideScreenDimensions>{children}</ProvideScreenDimensions>

  it("should give us dimensions", () => {
    const { result } = renderHook(() => useScreenDimensions(), { wrapper })

    expect(result.current).toStrictEqual({
      width: 380,
      height: 550,
      orientation: "portrait",
      safeAreaInsets: {
        top: 20,
        bottom: 0,
        left: 0,
        right: 0,
      },
    })
  })
})
