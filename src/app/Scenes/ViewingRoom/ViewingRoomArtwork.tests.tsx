import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Button } from "palette"
import { MockPayloadGenerator } from "relay-test-utils"
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
    const tree = renderWithRelay()

    await flushPromiseQueue()

    tree.env.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
          slug: "alessandro-pessoli-ardente-primavera-number-1",
        }),
      })
      return result
    })

    await flushPromiseQueue()

    tree.UNSAFE_getByType(Button).props.onPress()

    expect(navigate).toHaveBeenCalledWith(
      "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1"
    )
  })
})
