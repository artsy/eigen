import { fireEvent, screen } from "@testing-library/react-native"
import { ShareHeaderButton } from "app/Components/ShareSheet/ShareHeaderButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import RNShare from "react-native-share"

const mockShowShareSheet = jest.fn()
jest.mock("app/Components/ShareSheet/ShareSheetContext", () => ({
  useShareSheet: () => ({
    showShareSheet: mockShowShareSheet,
  }),
}))

describe("ShareHeaderButton", () => {
  beforeEach(() => {
    mockShowShareSheet.mockClear()
  })

  it("opens the app's share sheet for the page", () => {
    renderWithWrappers(
      <ShareHeaderButton
        href="/show/the-big-show"
        internalID="show-id"
        name="The Big Show"
        slug="the-big-show"
        utmContent="show-share"
        accessibilityLabel="Share Show"
      />
    )

    fireEvent.press(screen.getByLabelText("Share Show"))

    expect(mockShowShareSheet).toHaveBeenCalledWith({
      type: "default",
      href: "/show/the-big-show",
      internalID: "show-id",
      slug: "the-big-show",
      title: "The Big Show",
      utmContent: "show-share",
    })
    expect(RNShare.open).not.toHaveBeenCalled()
  })
})
