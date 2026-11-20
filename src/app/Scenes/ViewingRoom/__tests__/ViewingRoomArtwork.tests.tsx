import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ViewingRoomArtworkScreen } from "app/Scenes/ViewingRoom/ViewingRoomArtwork"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ViewingRoomArtwork", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => {
      return (
        <ViewingRoomArtworkScreen
          viewingRoomID="zero-dot-dot-dot-alessandro-pessoli"
          artwork_id="alessandro-pessoli-ardente-primavera-number-1"
        />
      )
    },
  })

  it("links to the artwork screen", async () => {
    await renderWithRelay({
      Artwork: () => ({
        href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
        slug: "alessandro-pessoli-ardente-primavera-number-1",
      }),
    })

    await waitFor(() =>
      expect(screen.queryByTestId("viewing-room-artwork-placeholder")).not.toBeOnTheScreen()
    )

    await fireEvent.press(screen.getByText("View more details"))

    expect(navigate).toHaveBeenCalledWith(
      "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1"
    )
  })
})
