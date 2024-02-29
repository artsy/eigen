import { fireEvent, screen } from "@testing-library/react-native"
import { PartnerOfferCreatedNotification_Test_Query } from "__generated__/PartnerOfferCreatedNotification_Test_Query.graphql"
import { PartnerOfferCreatedNotification } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

describe("PartnerOfferCreatedNotification", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<PartnerOfferCreatedNotification_Test_Query>(
      graphql`
        query PartnerOfferCreatedNotification_Test_Query {
          me {
            notification(id: "test-id") {
              ...PartnerOfferCreatedNotification_notification
            }
          }
        }
      `,
      {}
    )

    if (!data.me?.notification) {
      return null
    }

    return <PartnerOfferCreatedNotification notification={data.me?.notification} />
  }

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={null}>
        <TestRenderer />
      </Suspense>
    ),
  })

  describe("", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("renders all elements", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("Offers")).toBeTruthy()
      expect(screen.getByText("Limited Time Offer")).toBeTruthy()
      expect(
        screen.getByText("This offer has expired. Please make a new offer or contact the gallery")
      ).toBeTruthy()
    })

    it("navigates to the Saves", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await flushPromiseQueue()

      const manageSavesLink = screen.getByText("Manage Saves")

      fireEvent.press(manageSavesLink)

      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("/artwork-lists")
    })

    it("renders correct offer status and CTA when expired", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await flushPromiseQueue()
      expect(screen.getByText("Expired")).toBeTruthy()
    })
  })
})

const notification = {
  headline: "Saved work by Tracey Emin",
  notificationType: "PARTNER_OFFER_CREATED",
  item: {
    __typename: "PartnerOfferCreatedNotificationItem",
    expiresAt: "2024-02-19T17:36:48.896Z",
    available: true,
    partnerOffer: {
      endAt: "2024-02-19T11:36:48-06:00",
      isAvailable: true,
      priceListedMessage: "$450,000",
      priceWithDiscountMessage: "$405,000",
    },
  },
  artworksConnection: {
    edges: [
      {
        node: {
          internalID: "internal-artwork-id",
          slug: "tracey-emin-move-me-4",
          href: "/artwork/tracey-emin-move-me-4",
          title: "Move me",
        },
      },
    ],
    totalCount: 1,
  },
  targetHref: "/artwork/tracey-emin-move-me-4",
}
