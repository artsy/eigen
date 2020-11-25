import { navigate } from "lib/navigation/navigate"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { RelayEnvironmentProvider } from "relay-hooks"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworkQueryRenderer } from "../ViewingRoomArtwork"

jest.unmock("react-relay")

describe("ViewingRoomArtwork", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ViewingRoomArtworkQueryRenderer
        viewing_room_id="zero-dot-dot-dot-alessandro-pessoli"
        artwork_id="alessandro-pessoli-ardente-primavera-number-1"
      />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("links to the artwork screen", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
          slug: "alessandro-pessoli-ardente-primavera-number-1",
        }),
      })
      return result
    })

    tree.root.findByType(Button).props.onPress()

    expect(navigate).toHaveBeenCalledWith(
      "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1"
    )
  })
})
