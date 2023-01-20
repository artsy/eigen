import { ContextModule, OwnerType } from "@artsy/cohesion"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SellWithArtsyRecentlySold } from "./Components/SellWithArtsyRecentlySold"
import { SellWithArtsyHomeQueryRenderer } from "./SellWithArtsyHome"

jest.unmock("react-relay")

jest.mock("../../utils/useStatusBarStyle", () => {
  return {
    useLightStatusBarStyle: jest.fn(),
  }
})

describe("ConsignmentsHome index", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestWrapper = () => {
    return <SellWithArtsyHomeQueryRenderer environment={mockEnvironment} />
  }

  it("renders dynamic components", () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate)

    expect(tree.root.findAllByType(SellWithArtsyRecentlySold)).toHaveLength(1)
  })

  it("tracks a cta tap in the header", () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />)
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
    const tree = renderWithWrappersLEGACY(<TestWrapper />)
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
