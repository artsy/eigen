import { fireEvent, screen } from "@testing-library/react-native"
import { goBack } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import {
  ARTWORK_ATTRIBUTION_CLASS_FAQ_QUERY,
  ArtworkAttributionClassFAQContainer,
} from "./ArtworkAttributionClassFAQ"

const { renderWithRelay } = setupTestWrapper({
  Component: ArtworkAttributionClassFAQContainer,
  query: ARTWORK_ATTRIBUTION_CLASS_FAQ_QUERY,
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
