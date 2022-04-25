import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { MyCollectionInsightsOverview } from "./MyCollectionInsightsOverview"

describe("MyCollectionInsightsOverview", () => {
  const TestRenderer = () => {
    return <MyCollectionInsightsOverview />
  }

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<TestRenderer />)
  })

  it("renders correct titles", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    expect(getByText("Total Artworks")).toBeTruthy()
    expect(getByText("Total Artists")).toBeTruthy()
  })
})
