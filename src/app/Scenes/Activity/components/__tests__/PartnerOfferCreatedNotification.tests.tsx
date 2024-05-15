import { fireEvent, screen } from "@testing-library/react-native"
import { PartnerOfferCreatedNotification_Test_Query } from "__generated__/PartnerOfferCreatedNotification_Test_Query.graphql"
import { PartnerOfferCreatedNotification } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"

describe("PartnerOfferCreatedNotification", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerOfferCreatedNotification_Test_Query>({
    Component: (props) => (
      <PartnerOfferCreatedNotification notification={props.me?.notification!} />
    ),
    query: graphql`
      query PartnerOfferCreatedNotification_Test_Query {
        me {
          notification(id: "test-id") {
            ...PartnerOfferCreatedNotification_notification
          }
        }
      }
    `,
  })

  describe("available notification", () => {
    describe("when the offer is from Saves", () => {
      it("renders all elements", () => {
        renderWithRelay({ Me: () => ({ notification: availableNotification }) })

        expect(screen.getByText("Offers")).toBeOnTheScreen()
        expect(screen.getByText("Limited-Time Offer")).toBeOnTheScreen()
        expect(screen.getByText(/Expires in/i)).toBeOnTheScreen()
        expect(screen.getByText("$405,000")).toBeOnTheScreen()
        expect(screen.getByText(/List price:\s*\$450,000\s*/)).toBeOnTheScreen()
        expect(screen.getByText('"This is a note from the gallery"')).toBeOnTheScreen()
        expect(screen.getByText("Review the offer on your saved artwork")).toBeOnTheScreen()
        expect(screen.getByText("Manage Saves")).toBeOnTheScreen()
      })
    })

    describe("when the offer is not from Saves", () => {
      it("renders all elements", () => {
        const { item } = availableNotification

        renderWithRelay({
          Me: () => ({
            notification: {
              ...availableNotification,
              item: {
                ...item,
                partnerOffer: { ...item.partnerOffer, source: "ABANDONED_ORDER" },
              },
            },
          }),
        })

        expect(screen.getByText("Offers")).toBeOnTheScreen()
        expect(screen.getByText("Limited-Time Offer")).toBeOnTheScreen()
        expect(screen.getByText(/Expires in/i)).toBeOnTheScreen()
        expect(screen.getByText("$405,000")).toBeOnTheScreen()
        expect(screen.getByText(/List price:\s*\$450,000\s*/)).toBeOnTheScreen()
        expect(screen.getByText('"This is a note from the gallery"')).toBeOnTheScreen()
        expect(screen.getByText("Review the offer before it expires")).toBeOnTheScreen()
        expect(screen.queryByText("Review the offer on your saved artwork")).not.toBeOnTheScreen()
        expect(screen.queryByText("Manage Saves")).not.toBeOnTheScreen()
      })
    })
  })

  describe("expired notification", () => {
    it("renders all elements", () => {
      renderWithRelay({ Me: () => ({ notification: expiredNotification }) })

      expect(screen.getByText("Offers")).toBeOnTheScreen()
      expect(screen.getByText("Limited-Time Offer")).toBeOnTheScreen()
      expect(
        screen.getByText("This offer has expired. Please make a new offer or contact the gallery")
      ).toBeOnTheScreen()
    })

    it("navigates to the Saves", () => {
      renderWithRelay({ Me: () => ({ notification: expiredNotification }) })

      const manageSavesLink = screen.getByText("Manage Saves")

      fireEvent.press(manageSavesLink)

      expect(navigate).toHaveBeenCalledWith("/artwork-lists")
    })

    it("renders correct offer status and CTA when expired", () => {
      renderWithRelay({ Me: () => ({ notification: expiredNotification }) })

      expect(screen.getByText("Expired")).toBeOnTheScreen()
    })
  })

  describe("price hidden notification", () => {
    it("renders the proper copy", () => {
      renderWithRelay({ Me: () => ({ notification: priceHiddenNotification }) })

      expect(screen.getByText("Offers")).toBeOnTheScreen()
      expect(screen.getByText("Limited-Time Offer")).toBeOnTheScreen()
      expect(screen.getByText(/Expires in/i)).toBeOnTheScreen()
      expect(screen.getByText("$405,000")).toBeOnTheScreen()
      expect(screen.getByText(/Not publicly listed/i)).toBeOnTheScreen()
    })
  })
})

const artwork = {
  internalID: "internal-artwork-id",
  slug: "tracey-emin-move-me-4",
  href: "/artwork/tracey-emin-move-me-4",
  title: "Move me",
  price: "$450,000",
}

const notificationFixture = {
  headline: "Saved work by Tracey Emin",
  notificationType: "PARTNER_OFFER_CREATED",
  targetHref: "/artwork/tracey-emin-move-me-4",
}

const partnerOffer = {
  endAt: DateTime.now().plus({ year: 1 }).toISO(),
  isAvailable: true,
  note: "This is a note from the gallery",
  priceWithDiscount: {
    display: "$405,000",
  },
  source: "SAVE",
}

const partnerOfferFixture = {
  expiresAt: DateTime.now().plus({ year: 1 }).toISO(),
  available: true,
  partnerOffer,
}

const priceHiddenNotification = {
  ...notificationFixture,
  item: { ...partnerOfferFixture, partnerOffer },
  artworksConnection: { edges: [{ node: { ...artwork, price: null } }] },
}

const availableNotification = {
  ...notificationFixture,
  item: { ...partnerOfferFixture, partnerOffer },
  artworksConnection: { edges: [{ node: artwork }] },
}

const expiredNotification = {
  ...notificationFixture,
  item: {
    ...partnerOfferFixture,
    expiresAt: DateTime.now().minus({ month: 1 }).toISO(),
    partnerOffer: { ...partnerOffer, endAt: DateTime.now().minus({ month: 1 }).toISO() },
  },
  artworksConnection: { edges: [{ node: artwork }] },
}
