import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Theme } from "@artsy/palette"
import React from "react"
import { create } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ConsignmentsHomeQueryRenderer } from "../"
import { ArtistList } from "../Components/ArtistList"
import { RecentlySold } from "../Components/RecentlySold"

jest.unmock("react-relay")
jest.mock("react-tracking")

describe("ConsignmentsHome index", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const trackEvent = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockReturnValue({
      trackEvent,
    })
  })

  afterEach(() => {
    trackEvent.mockClear()
  })

  const TestWrapper = () => {
    return (
      <Theme>
        <ConsignmentsHomeQueryRenderer environment={mockEnvironment} />
      </Theme>
    )
  }

  it("renders dynamic components", () => {
    const tree = create(<TestWrapper />)

    mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate)

    expect(tree.root.findAllByType(RecentlySold)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistList)).toHaveLength(1)
  })

  it("tracks a cta tap in the header", () => {
    const tree = create(<TestWrapper />)
    mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate)

    tree.root.findByProps({ "data-test-id": "header-cta" }).props.onPress()

    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        context_module: ContextModule.sellHeader,
        context_screen_owner_type: OwnerType.sell,
        subject: "Start selling",
      })
    )
  })

  it("tracks a cta tap in the footer", () => {
    const tree = create(<TestWrapper />)
    mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate)

    tree.root.findByProps({ "data-test-id": "footer-cta" }).props.onPress()

    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        context_module: ContextModule.sellFooter,
        context_screen_owner_type: OwnerType.sell,
        subject: "Start selling",
      })
    )
  })
})
