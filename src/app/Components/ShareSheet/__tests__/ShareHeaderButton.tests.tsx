import { fireEvent, screen } from "@testing-library/react-native"
import { ShareHeaderButton } from "app/Components/ShareSheet/ShareHeaderButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import RNShare from "react-native-share"

describe("ShareHeaderButton", () => {
  it("opens the share sheet with the page's URL and name", () => {
    renderWithWrappers(
      <ShareHeaderButton
        href="/show/the-big-show"
        name="The Big Show"
        utmContent="show-share"
        accessibilityLabel="Share Show"
      />
    )

    fireEvent.press(screen.getByLabelText("Share Show"))

    expect(RNShare.open).toHaveBeenCalledWith({
      title: "The Big Show",
      message:
        "View The Big Show on Artsy\nhttps://staging.artsy.net/show/the-big-show?utm_content=show-share",
      failOnCancel: false,
    })
  })
})
