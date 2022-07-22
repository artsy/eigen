import { navigate } from "app/navigation/navigate"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Button } from "palette"
import { RelayEnvironmentProvider } from "react-relay"
import { ViewingRoomArtworkScreen } from "./ViewingRoomArtwork"

describe("ViewingRoomArtwork", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={getRelayEnvironment()}>
      <ViewingRoomArtworkScreen
        viewing_room_id="zero-dot-dot-dot-alessandro-pessoli"
        artwork_id="alessandro-pessoli-ardente-primavera-number-1"
      />
    </RelayEnvironmentProvider>
  )

  it("links to the artwork screen", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    await flushPromiseQueue()
    resolveMostRecentRelayOperation({
      Artwork: () => ({
        href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
        slug: "alessandro-pessoli-ardente-primavera-number-1",
      }),
    })
    await flushPromiseQueue()

    tree.root.findByType(Button).props.onPress()

    expect(navigate).toHaveBeenCalledWith(
      "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1"
    )
  })
})
