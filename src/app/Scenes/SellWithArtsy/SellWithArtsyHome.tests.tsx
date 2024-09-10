import { fireEvent, screen } from "@testing-library/react-native"
import { SellWithArtsyHomeTestQuery } from "__generated__/SellWithArtsyHomeTestQuery.graphql"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { SellWithArtsyHome } from "./SellWithArtsyHome"

jest.mock("../../utils/useStatusBarStyle", () => {
  return {
    useLightStatusBarStyle: jest.fn(),
    useSwitchStatusBarStyle: jest.fn(),
  }
})

describe("SellWithArtsyHome", () => {
  const { renderWithRelay } = setupTestWrapper<SellWithArtsyHomeTestQuery>({
    Component: (props) => {
      if (props?.me) {
        return <SellWithArtsyHome />
      }

      return null
    },
    variables: { submissionID: "1234", includeSubmission: false },
    query: graphql`
      query SellWithArtsyHomeTestQuery($submissionID: ID, $includeSubmission: Boolean = false)
      @relay_test_operation {
        recentlySoldArtworks {
          ...SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection
        }
        me {
          internalID
          name
          email
          phone
        }
        submission(id: $submissionID) @include(if: $includeSubmission) {
          ...Header_submission
        }
        staticContent {
          ...MeetTheSpecialists_staticContent
        }
      }
    `,
  })

  describe("Tracking", () => {
    // HEADER
    describe("Header Events", () => {
      it("tracks Consign Events", async () => {
        renderWithRelay({})
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
        renderWithRelay({
          StaticContent: () => ({
            specialistBios: [
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
          }),
        })
        const headerInquiryButton = screen.getByTestId("MeetTheSpecialists-contact-CTA")

        fireEvent(headerInquiryButton, "onPress")
        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent).toHaveBeenLastCalledWith(
          expect.objectContaining({
            action: "tappedConsignmentInquiry",
            context_module: "sellMeetTheSpecialists",
            context_screen: "sell",
            context_screen_owner_type: "sell",
            subject: "Contact Dana",
          })
        )
      })
    })

    // MEETTHESPECIALISTS
    describe("MeetTheSpecialists Events", () => {
      it("tracks Inquiry Events", () => {
        renderWithRelay({})
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
        renderWithRelay({})
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
