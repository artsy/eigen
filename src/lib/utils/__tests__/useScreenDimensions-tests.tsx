import { renderHook } from "@testing-library/react-hooks"
import React, { ReactNode } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useScreenDimensions } from "../useScreenDimensions"

describe(useScreenDimensions, () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 380, height: 550 },
        insets: { top: 20, left: 0, right: 0, bottom: 0 },
      }}
    >
      {children}
    </SafeAreaProvider>
  )

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
      fullWidth: 380,
      fullHeight: 570,
    })
  })
})
