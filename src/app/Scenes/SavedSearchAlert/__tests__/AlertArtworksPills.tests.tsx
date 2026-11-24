import { screen, waitFor } from "@testing-library/react-native"
import { AlertArtworksPillsQuery } from "__generated__/AlertArtworksPillsQuery.graphql"
import {
  AlertArtworksPills,
  AlertArtworksPillsPlaceholder,
} from "app/Scenes/SavedSearchAlert/AlertArtworksPills"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"

describe("AlertArtworksPills", () => {
  const { renderWithRelay } = setupTestWrapper<AlertArtworksPillsQuery>({
    Component: () => (
      <Suspense fallback={<AlertArtworksPillsPlaceholder />}>
        <AlertArtworksPills alertId="alert-id" />
      </Suspense>
    ),
  })

  it("renders pills, grid and buttons", async () => {
    await renderWithRelay({
      Me: () => ({
        alert: {
          pills: [
            { field: "artistIDs", displayValue: "Banksy" },
            { field: "attributionClass", displayValue: "Limited edition" },
          ],
        },
      }),
    })

    await waitFor(() => expect(screen.queryByTestId("pills-placeholder")).not.toBeOnTheScreen())

    expect(screen.getByText("Banksy")).toBeOnTheScreen()
    expect(screen.getByText("Limited edition")).toBeOnTheScreen()
  })
})
