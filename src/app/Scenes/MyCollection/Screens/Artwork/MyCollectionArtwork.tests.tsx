import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { MyCollectionArtworkScreen } from "./MyCollectionArtwork"

describe("My Collection Artwork", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: MyCollectionArtworkScreen })

  it("show new artwork screen ", async () => {
    renderWithRelay({
      Artwork: () => ({
        id: "random-id",
        artist: { internalID: "internal-id" },
        medium: "medium",
        category: "medium",
      }),
    })

    await waitForElementToBeRemoved(
      () => screen.queryByTestId("my-collection-artwork-placeholder"),
      {
        timeout: 10000,
      }
    )

    expect(() => screen.getByTestId("my-collection-artwork")).toBeTruthy()
  })

  describe("Edit button", () => {
    it("should be hidden when consignmentSubmission is available", async () => {
      renderWithRelay({
        Artwork: () => ({
          id: "random-id",
          artist: { internalID: "internal-id" },
          medium: "medium",
          category: "medium",
          consignmentSubmission: { internalID: "submission-id" },
        }),
      })

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("my-collection-artwork-placeholder")
      )

      expect(screen.queryByText("Edit")).not.toBeOnTheScreen()
    })

    it("should be visible when consignmentSubmission is not available", async () => {
      renderWithRelay({
        Artwork: () => ({
          id: "random-id",
          artist: { internalID: "internal-id" },
          medium: "medium",
          category: "medium",
          consignmentSubmission: null,
        }),
      })

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("my-collection-artwork-placeholder")
      )

      expect(screen.getByText("Edit")).toBeOnTheScreen()
    })
  })
})
