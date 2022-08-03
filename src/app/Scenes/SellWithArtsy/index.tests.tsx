import { ContextModule, OwnerType } from "@artsy/cohesion"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"

import { ArtistList } from "./Components/ArtistList"
import { RecentlySold } from "./Components/RecentlySold"
import { SellWithArtsyHomeQueryRenderer } from "./SellWithArtsyHome"

describe("ConsignmentsHome index", () => {
  const TestWrapper = () => {
    return <SellWithArtsyHomeQueryRenderer environment={getRelayEnvironment()} />
  }

  it("renders dynamic components", () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    resolveMostRecentRelayOperation()

    expect(tree.root.findAllByType(RecentlySold)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistList)).toHaveLength(1)
  })

  it("tracks a cta tap in the header", () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />)
    resolveMostRecentRelayOperation()

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
    const tree = renderWithWrappersLEGACY(<TestWrapper />)
    resolveMostRecentRelayOperation()

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
