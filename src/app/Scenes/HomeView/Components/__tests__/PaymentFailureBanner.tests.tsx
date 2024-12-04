import { fireEvent, screen } from "@testing-library/react-native"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockUseIsFocusedMock = jest.fn()

jest.mock("app/Scenes/HomeView/hooks/useHomeViewTracking", () => ({
  useHomeViewTracking: jest.fn(),
}))

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: () => mockUseIsFocusedMock(),
}))

describe("PaymentFailureBanner", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: PaymentFailureBanner,
    query: graphql`
      query PaymentFailureBannerTestsQuery {
        commerceMyOrders(first: 10, filters: [PAYMENT_FAILED]) {
          edges {
            node {
              code
              internalID
            }
          }
        }
      }
    `,
    variables: {},
  })

  const mockTracking = {
    bannerViewed: jest.fn(),
    tappedChangePaymentMethod: jest.fn(),
  }

  beforeEach(() => {
    mockUseIsFocusedMock.mockReturnValue(false)
    jest.clearAllMocks()
    ;(useHomeViewTracking as jest.Mock).mockReturnValue(mockTracking)
  })

  it("renders the error banner when a single payment has failed", () => {
    renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              code: "order-1",
              internalID: "1",
            },
          },
        ],
      }),
    })

    const link = screen.getByText("Update payment method.")
    const text = screen.getByText("Payment failed for your recent order.")

    expect(link).toBeTruthy()
    expect(text).toBeTruthy()

    fireEvent.press(link)
    expect(navigate).toHaveBeenCalledWith("orders/1/payment/new")
  })

  it("renders the error banner when multiple payments have failed", () => {
    renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              code: "order-1",
              internalID: "1",
            },
          },
          {
            node: {
              code: "order-2",
              internalID: "2",
            },
          },
        ],
      }),
    })
    const link = screen.getByText("Update payment method for each order.")
    const text = screen.getByText("Payment failed for your recent orders.")

    expect(link).toBeTruthy()
    expect(text).toBeTruthy()

    fireEvent.press(link)
    expect(navigate).toHaveBeenCalledWith("orders")
  })

  it("does not render the banner when there are no payment failures", () => {
    renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [],
      }),
    })

    expect(screen.queryByTestId("PaymentFailureBanner")).toBeNull()
  })

  it("calls bannerViewed tracking event when the banner is visible", () => {
    renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              code: "order-1",
              internalID: "1",
            },
          },
        ],
      }),
    })

    expect(mockTracking.bannerViewed).toHaveBeenCalledWith([{ code: "order-1", internalID: "1" }])
  })

  it("calls tappedChangePaymentMethod tracking event when the link is clicked", () => {
    renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              code: "order-1",
              internalID: "1",
            },
          },
        ],
      }),
    })

    const link = screen.getByText("Update payment method.")
    fireEvent.press(link)

    expect(mockTracking.bannerViewed).toHaveBeenCalledWith([{ code: "order-1", internalID: "1" }])
  })
})
