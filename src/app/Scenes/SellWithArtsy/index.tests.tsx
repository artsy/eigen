import { ContextModule, OwnerType } from "@artsy/cohesion"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtistList } from "./Components/ArtistList"
import { RecentlySold } from "./Components/RecentlySold"
import { SellWithArtsyHomeQueryRenderer } from "./SellWithArtsyHome"

jest.unmock("react-relay")

describe("ConsignmentsHome index", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestWrapper = () => {
    return <SellWithArtsyHomeQueryRenderer environment={mockEnvironment} />
  }

  it("renders dynamic components", () => {
    const tree = renderWithWrappers(<TestWrapper />)

    mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate)

    expect(tree.root.findAllByType(RecentlySold)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistList)).toHaveLength(1)
  })

  it("tracks a cta tap in the header", () => {
    const tree = renderWithWrappers(<TestWrapper />)
    mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate)

    tree.root.findByProps({ testID: "header-cta" }).props.onPress()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        context_module: ContextModule.sellHeader,
        context_screen_owner_type: OwnerType.sell,
        subject: "Submit a work",
      })
    )
  })

  it("tracks a cta tap in the footer", () => {
    const tree = renderWithWrappers(<TestWrapper />)
    mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate)

    tree.root.findByProps({ testID: "footer-cta" }).props.onPress()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        context_module: ContextModule.sellFooter,
        context_screen_owner_type: OwnerType.sell,
        subject: "Submit a work",
      })
    )
  })
})
