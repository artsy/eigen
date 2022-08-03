import { screen } from "@testing-library/react-native"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { waitForSuspenseToBeRemoved } from "app/tests/waitForSupenseToBeRemoved"
import { AverageSalePriceAtAuction } from "./AverageSalePriceAtAuction"

describe("AverageSalePriceAtAuction", () => {
  const TestRenderer = () => <AverageSalePriceAtAuction artistID="artist-id" />

  it("renders title", async () => {
    renderWithRelayWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Artist: () => ({
        internalID: "artist-id",
        name: "Artist Name",
        imageUrl: "image-url",
      }),
    })
    await waitForSuspenseToBeRemoved()

    expect(screen.getByTestId("Average_Auction_Price_title")).toBeTruthy()
  })
})
