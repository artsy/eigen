import { ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SellWithArtsyRecentlySold } from "./Components/SellWithArtsyRecentlySold"
import { SellWithArtsyHomeQueryRenderer } from "./SellWithArtsyHome"

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
        subject: "Submit an Artwork",
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
        subject: "Submit an Artwork",
      })
    )
  })
})

describe("New SellWithArtsyLandingPage", () => {
  describe("Tracking", () => {
    let mockEnvironment: ReturnType<typeof createMockEnvironment>

    beforeEach(() => {
      mockEnvironment = createMockEnvironment()
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewSWALandingPage: true })
    })

    const TestWrapper = () => {
      return <SellWithArtsyHomeQueryRenderer environment={mockEnvironment} />
    }

    // HEADER
    describe("Header Events", () => {
      it("tracks Consign Events", () => {
        const { getByTestId } = renderWithWrappers(<TestWrapper />)
        const headerConsignButton = getByTestId("Header-consign-CTA")

        fireEvent(headerConsignButton, "onPress")
        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent).toHaveBeenLastCalledWith(
          expect.objectContaining({
            action: "tappedConsign",
            context_module: "sellHeader",
            context_screen_owner_type: "sell",
            destination_screen_owner_type: "consignmentSubmission",
            subject: "Start Selling",
          })
        )
      })

      it("tracks Inquiry Events", () => {
        const { getByTestId } = renderWithWrappers(<TestWrapper />)
        const headerInquiryButton = getByTestId("Header-inquiry-CTA")

        fireEvent(headerInquiryButton, "onPress")
        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent).toHaveBeenLastCalledWith(
          expect.objectContaining({
            action: "tappedConsignmentInquiry",
            context_module: "sellHeader",
            context_screen: "sell",
            context_screen_owner_type: "sell",
            subject: "Get in Touch",
          })
        )
      })
    })

    // HOWITWORKS
    describe("HowItWorks Events", () => {
      it("tracks Consign Events", () => {
        const { getByTestId } = renderWithWrappers(<TestWrapper />)
        const headerConsignButton = getByTestId("HowItWorks-consign-CTA")

        fireEvent(headerConsignButton, "onPress")
        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent).toHaveBeenLastCalledWith(
          expect.objectContaining({
            action: "tappedConsign",
            context_module: "sellHowItWorks",
            context_screen_owner_type: "sell",
            destination_screen_owner_type: "consignmentSubmission",
            subject: "Start Selling",
          })
        )
      })
    })

    // MEETTHESPECIALISTS
    describe("MeetTheSpecialists Events", () => {
      it("tracks Inquiry Events", () => {
        const { getByTestId } = renderWithWrappers(<TestWrapper />)
        const headerConsignButton = getByTestId("MeetTheSpecialists-inquiry-CTA")

        fireEvent(headerConsignButton, "onPress")
        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent).toHaveBeenLastCalledWith(
          expect.objectContaining({
            action: "tappedConsignmentInquiry",
            context_module: "sellMeetTheSpecialists",
            context_screen: "sell",
            context_screen_owner_type: "sell",
            subject: "Get in Touch",
          })
        )
      })
    })

    // SPEAKTOTHETEAM
    describe("SpeakToTheTeam Events", () => {
      it("tracks Inquiry Events", () => {
        const { getByTestId } = renderWithWrappers(<TestWrapper />)
        const headerConsignButton = getByTestId("SpeakToTheTeam-inquiry-CTA")

        fireEvent(headerConsignButton, "onPress")
        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent).toHaveBeenLastCalledWith(
          expect.objectContaining({
            action: "tappedConsignmentInquiry",
            context_module: "sellSpeakToTheTeam",
            context_screen: "sell",
            context_screen_owner_type: "sell",
            subject: "Get in Touch",
          })
        )
      })
    })
  })
})
