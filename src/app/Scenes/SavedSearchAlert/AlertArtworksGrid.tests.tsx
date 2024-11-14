import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { AlertArtworksGridQuery } from "__generated__/AlertArtworksGridQuery.graphql"
import {
  AlertArtworksGrid,
  AlertArtworksGridPlaceholder,
} from "app/Scenes/SavedSearchAlert/AlertArtworksGrid"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"

describe("AlertArtworksGrid", () => {
  const { renderWithRelay } = setupTestWrapper<AlertArtworksGridQuery>({
    Component: () => (
      <Suspense fallback={<AlertArtworksGridPlaceholder />}>
        <AlertArtworksGrid alertId="alert-id" />
      </Suspense>
    ),
  })

  describe("no artworks matches", () => {
    it("shows no matches message and edit alert button", async () => {
      renderWithRelay({
        Me: () => ({
          alert: {
            artistIDs: ["banksy"],
          },
        }),

        FilterArtworksConnection: () => ({ counts: { total: 0 } }),
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("alert-artworks-grid-placeholder"))

      expect(screen.getByText("No matches")).toBeOnTheScreen()
      expect(
        screen.getByText("There aren't any works available that meet the criteria at this time.")
      ).toBeOnTheScreen()
      expect(screen.getByText("Edit Alert")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Edit Alert"))
      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("favorites/alerts/alert-id/edit")
    })
  })

  describe("with artworks matches", () => {
    it("shows artworks grid and both buttons", async () => {
      renderWithRelay({
        Me: () => ({
          alert: {
            artistIDs: ["banksy"],
          },
        }),
        FilterArtworksConnection: () => artworksConnection,
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("alert-artworks-grid-placeholder"))

      expect(screen.getByText("Untitled #1")).toBeOnTheScreen()
      expect(screen.getByText("Untitled #2")).toBeOnTheScreen()

      expect(screen.getByText("Edit Alert")).toBeOnTheScreen()
      expect(screen.getByText("See all Matching Works")).toBeOnTheScreen()
    })

    it("edit alert button navigates to the edit screen", async () => {
      renderWithRelay({
        Me: () => ({
          alert: {
            artistIDs: ["banksy"],
          },
        }),
        FilterArtworksConnection: () => artworksConnection,
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("alert-artworks-grid-placeholder"))

      fireEvent.press(screen.getByText("Edit Alert"))
      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("favorites/alerts/alert-id/edit")
    })

    it("see all matching works button navigates to the artist screen", async () => {
      renderWithRelay({
        Me: () => ({
          alert: {
            artistIDs: ["banksy"],
          },
        }),
        FilterArtworksConnection: () => artworksConnection,
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("alert-artworks-grid-placeholder"))

      fireEvent.press(screen.getByText("See all Matching Works"))
      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("/artist/banksy", {
        passProps: { search_criteria_id: "alert-id" },
      })
    })
  })
})

const artworksConnection = {
  counts: {
    total: 11,
  },
  edges: [
    {
      node: {
        title: "Untitled #1",
      },
    },
    {
      node: {
        title: "Untitled #2",
      },
    },
  ],
}
