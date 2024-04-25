import { fireEvent, screen } from "@testing-library/react-native"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"
import { SellWithArtsyHomeQueryRenderer } from "./SellWithArtsyHome"

jest.mock("../../utils/useStatusBarStyle", () => {
  return {
    useLightStatusBarStyle: jest.fn(),
    useSwitchStatusBarStyle: jest.fn(),
  }
})

jest.mock("./utils/useSWALandingPageData", () => {
  return {
    useSWALandingPageData: jest.fn().mockImplementation(() => {
      return {
        data: {
          specialists: [
            {
              specialty: "collectorServices",
              name: "Dana Rodriguez",
              firstName: "Dana",
              jobTitle: "Associate, Collector Services",
              bio: "20-year veteran as the VP of Artsy's commercial and benefit auctions businesses.",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
              email: "dana.rodriguez@artsy.net",
            },
          ],
          testimonials: [
            {
              reviewText:
                "My specialist kept me transparently informed from our initial conversation throughout. They took care of everything smoothly - from finding the right buyer to taking care of shipping and final payment.",
              image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
              reviewerName: "Joe Bloggs",
              gallery: "White Cube Gallery",
            },
          ],
        },
        loading: false,
      }
    }),
  }
})

describe("New SellWithArtsyLandingPage", () => {
  describe("Tracking", () => {
    let mockEnvironment: ReturnType<typeof createMockEnvironment>

    beforeEach(() => {
      mockEnvironment = createMockEnvironment()
    })

    const TestWrapper = () => {
      return <SellWithArtsyHomeQueryRenderer environment={mockEnvironment} />
    }

    // HEADER
    describe("Header Events", () => {
      it("tracks Consign Events", () => {
        renderWithWrappers(<TestWrapper />)
        const headerConsignButton = screen.getByTestId("header-consign-CTA")

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
        renderWithWrappers(<TestWrapper />)
        const headerInquiryButton = screen.getByTestId("Header-inquiry-CTA")

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
        renderWithWrappers(<TestWrapper />)
        const headerConsignButton = screen.getByTestId("HowItWorks-consign-CTA")

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
        renderWithWrappers(<TestWrapper />)
        const headerConsignButton = screen.getByTestId("MeetTheSpecialists-inquiry-CTA")

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
        renderWithWrappers(<TestWrapper />)
        const headerConsignButton = screen.getByTestId("SpeakToTheTeam-inquiry-CTA")

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
