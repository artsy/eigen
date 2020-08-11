import { Button, Theme } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "relay-hooks"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworkQueryRenderer } from "../ViewingRoomArtwork"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("ViewingRoomArtwork", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <ViewingRoomArtworkQueryRenderer
          viewing_room_id="zero-dot-dot-dot-alessandro-pessoli"
          artwork_id="alessandro-pessoli-ardente-primavera-number-1"
        />
      </RelayEnvironmentProvider>
    </Theme>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("links to the artwork screen", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
          slug: "alessandro-pessoli-ardente-primavera-number-1",
        }),
      })
      return result
    })

    tree.root.findByType(Button).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1"
    )
  })
})
