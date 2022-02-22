import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { BidFlow } from "./BidFlow"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

jest.mock("../Components/Bidding/Context/TimeOffsetProvider.tsx", () => ({
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  TimeOffsetProvider: ({ children }) => children,
}))

it("renders without throwing an error", () => {
  renderWithWrappers(
    <SafeAreaProvider>
      <BidFlow artworkID="artwork" saleID="sale" />
    </SafeAreaProvider>
  )
})
