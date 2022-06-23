import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { AverageSalePriceAtAuction } from "./AverageSalePriceAtAuction"

jest.unmock("react-relay")

describe("AverageSalePriceAtAuction", () => {
  const mockArtist = {
    name: "Andy Warhol",
    formattedNationalityAndBirthday: "American, 1928–1987",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/E-k-uLoQADM8AjadsSKHrA/square.jpg",
    initials: "AW",
  }

  const TestRenderer = () => <AverageSalePriceAtAuction artistData={mockArtist} />

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("renders title", async () => {
    const { getByTestId } = renderWithWrappersTL(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <TestRenderer />
      </RelayEnvironmentProvider>
    )

    expect(getByTestId("Average_Auction_Price_title")).toBeTruthy()
  })
})
