import { screen, waitFor } from "@testing-library/react-native"
import { PartnerOfferContainer } from "app/Scenes/PartnerOffer/PartnerOfferContainer"
import { goBack, navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useMutation } from "react-relay"

const mockCommit = jest.fn()

jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  useMutation: jest.fn(() => [mockCommit]),
}))

describe(PartnerOfferContainer, () => {
  const renderContainer = () => renderWithWrappers(<PartnerOfferContainer partnerOfferID="1234" />)

  describe("when the mutation executes", () => {
    beforeEach(() => {
      ;(useMutation as jest.Mock).mockReturnValue([mockCommit])
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("and returns an error", () => {
      it("navigates to the artwork when the error is expired_partner_offer", async () => {
        renderContainer()

        // mock onCompleted response
        mockCommit.mock.calls[0][0].onCompleted(mockResponses.expiredOffer)

        expect(screen.getByTestId("partner-offer-container-loading-screen")).toBeDefined()

        await waitFor(() => expect(mockCommit).toHaveBeenCalledOnce())
        expect(mockCommit).toHaveBeenCalledWith(
          expect.objectContaining({ variables: { input: { partnerOfferId: "1234" } } })
        )
        expect(navigate).toHaveBeenCalledWith("/artwork/1234", {
          replaceActiveScreen: true,
          passProps: { artworkOfferExpired: true },
        })
      })

      it("navigates to the artwork when the error is not_acquireable", async () => {
        renderContainer()

        mockCommit.mock.calls[0][0].onCompleted(mockResponses.notAcquireable)

        expect(screen.getByTestId("partner-offer-container-loading-screen")).toBeDefined()

        await waitFor(() => expect(mockCommit).toHaveBeenCalledOnce())
        expect(mockCommit).toHaveBeenCalledWith(
          expect.objectContaining({ variables: { input: { partnerOfferId: "1234" } } })
        )
        expect(navigate).toHaveBeenCalledWith("/artwork/1234", {
          replaceActiveScreen: true,
          passProps: { artworkOfferUnavailable: true },
        })
      })

      it("navigates to the home screen when the mutation gives different error", async () => {
        renderContainer()

        mockCommit.mock.calls[0][0].onCompleted(mockResponses.otherError)

        expect(screen.getByTestId("partner-offer-container-loading-screen")).toBeDefined()

        await waitFor(() => expect(mockCommit).toHaveBeenCalledOnce())
        expect(mockCommit).toHaveBeenCalledWith(
          expect.objectContaining({ variables: { input: { partnerOfferId: "1234" } } })
        )
        expect(goBack).toHaveBeenCalledOnce()
        expect(screen.getByText("An error occurred.")).toBeOnTheScreen()
      })
    })

    describe("and returns an an order", () => {
      it("navigates to the checkout flow", async () => {
        renderContainer()

        mockCommit.mock.calls[0][0].onCompleted(mockResponses.availableOffer)

        expect(screen.getByTestId("partner-offer-container-loading-screen")).toBeDefined()

        await waitFor(() => expect(mockCommit).toHaveBeenCalledOnce())
        expect(mockCommit).toHaveBeenCalledWith(
          expect.objectContaining({ variables: { input: { partnerOfferId: "1234" } } })
        )
        expect(goBack).toHaveBeenCalledOnce()
        expect(navigate).toHaveBeenCalledWith("/orders/order-id", {
          passProps: {
            title: "Purchase",
          },
        })
      })
    })

    describe("and the partner offer doesn't exist", () => {
      it("navigates to the home screen", async () => {
        renderContainer()

        mockCommit.mock.calls[0][0].onCompleted({ error: "PartnerOfferNotFoundError" })

        expect(screen.getByTestId("partner-offer-container-loading-screen")).toBeDefined()

        await waitFor(() => expect(mockCommit).toHaveBeenCalledOnce())
        expect(mockCommit).toHaveBeenCalledWith(
          expect.objectContaining({ variables: { input: { partnerOfferId: "1234" } } })
        )
        expect(goBack).toHaveBeenCalledOnce()
      })
    })
  })
})

const mockResponses = {
  expiredOffer: {
    commerceCreatePartnerOfferOrder: {
      orderOrError: {
        error: {
          code: "expired_partner_offer",
          data: JSON.stringify({ artwork_id: "1234" }),
        },
      },
    },
  },
  notAcquireable: {
    commerceCreatePartnerOfferOrder: {
      orderOrError: {
        error: {
          code: "not_acquireable",
          data: JSON.stringify({ artwork_id: "1234" }),
        },
      },
    },
  },
  otherError: {
    commerceCreatePartnerOfferOrder: {
      orderOrError: {
        error: {
          code: "some_other_error",
          data: JSON.stringify({ artwork_id: "1234" }),
        },
      },
    },
  },
  availableOffer: {
    commerceCreatePartnerOfferOrder: {
      orderOrError: {
        order: {
          internalID: "order-id",
          mode: "BUY",
        },
      },
    },
  },
}
