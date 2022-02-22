import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworkScreen } from "./ViewingRoomArtwork"

jest.unmock("react-relay")

describe("ViewingRoomArtwork", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ViewingRoomArtworkScreen
        viewing_room_id="zero-dot-dot-dot-alessandro-pessoli"
        artwork_id="alessandro-pessoli-ardente-primavera-number-1"
      />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("links to the artwork screen", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    await flushPromiseQueue()
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
          slug: "alessandro-pessoli-ardente-primavera-number-1",
        }),
      })
      return result
    })
    await flushPromiseQueue()

    tree.root.findByType(Button).props.onPress()

    expect(navigate).toHaveBeenCalledWith(
      "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1"
    )
  })
})
