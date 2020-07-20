import { MediumCard, Theme } from "@artsy/palette"
import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { RelayEnvironmentProvider } from "relay-hooks"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { FeaturedRail } from "../ViewingRoomsListFeatured"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe(FeaturedRail, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <FeaturedRail />
      </RelayEnvironmentProvider>
    </Theme>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("shows some cards", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        Query: () => ({
          viewingRooms: {
            edges: [
              {
                node: {
                  title: "ok",
                  href:
                    "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
                  slug: "alessandro-pessoli-ardente-primavera-number-1",
                  internalID: "one",
                },
              },
              {
                node: {
                  title: "oak",
                  href:
                    "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
                  slug: "alessand-pessoli-ardente-primavera-number-1",
                  internalID: "two",
                },
              },
            ],
          },
        }),
      })
      return result
    })

    expect(tree.root.findAllByType(MediumCard)).toHaveLength(2)
  })
})
