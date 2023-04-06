import { screen } from "@testing-library/react-native"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Button } from "app/Components/Button"
import { ViewingRoomArtworkScreen } from "./ViewingRoomArtwork"

describe("ViewingRoomArtwork", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => {
      return (
        <ViewingRoomArtworkScreen
          viewing_room_id="zero-dot-dot-dot-alessandro-pessoli"
          artwork_id="alessandro-pessoli-ardente-primavera-number-1"
        />
      )
    },
  })

  it("links to the artwork screen", async () => {
    renderWithRelay({
      Artwork: () => ({
        href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
        slug: "alessandro-pessoli-ardente-primavera-number-1",
      }),
    })

    await flushPromiseQueue()

    screen.UNSAFE_getByType(Button).props.onPress()

    expect(navigate).toHaveBeenCalledWith(
      "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1"
    )
  })
})
