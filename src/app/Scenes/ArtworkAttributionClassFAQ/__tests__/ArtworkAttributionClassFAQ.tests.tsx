import { fireEvent, screen } from "@testing-library/react-native"
import {
  ArtworkAttributionClassFAQContainer,
  ArtworkAttributionClassFAQScreenQuery,
} from "app/Scenes/ArtworkAttributionClassFAQ/ArtworkAttributionClassFAQ"
import { goBack } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const { renderWithRelay } = setupTestWrapper({
  Component: ArtworkAttributionClassFAQContainer,
  query: ArtworkAttributionClassFAQScreenQuery,
})

describe("ArtworkAttributionClassFAQ", () => {
  it("renders the header", () => {
    renderWithRelay()

    expect(screen.queryByText("Artwork classifications")).toBeOnTheScreen()
  })

  it("renders the OK button", () => {
    renderWithRelay()
    expect(screen.queryByText("OK")).toBeOnTheScreen()
  })

  it("renders attribution classes", async () => {
    renderWithRelay()

    expect(screen.queryByText(/mock-value-for-field-"name"/)).toBeOnTheScreen()
    expect(screen.queryByText(/mock-value-for-field-"longDescription"/)).toBeOnTheScreen()
  })

  it("returns to previous page when ok button is clicked", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText("OK"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
