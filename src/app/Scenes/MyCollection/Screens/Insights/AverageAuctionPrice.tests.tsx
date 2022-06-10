import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { AverageAuctionPrice } from "./AverageAuctionPrice"

describe("AverageAuctionPrice", () => {
  const TestRenderer = () => <AverageAuctionPrice />

  it("renders title", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    expect(getByTestId("Average_Auction_Price_title")).toBeTruthy()
  })
})
