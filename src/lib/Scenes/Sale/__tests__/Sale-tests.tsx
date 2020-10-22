import { SaleTestsQuery } from "__generated__/SaleTestsQuery.graphql"
import { navigate, popParentViewController } from "lib/navigation/navigate"
import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import moment from "moment"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { RegisterToBidButtonContainer } from "../Components/RegisterToBidButton"
import { Sale } from "../Sale"

jest.unmock("react-relay")

jest.mock("lib/navigation/navigate", () => ({
  popParentViewController: jest.fn(),
  navigate: jest.fn(),
}))

describe("Sale", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<SaleTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleTestsQuery($saleID: String!) @relay_test_operation {
          sale(id: $saleID) {
            internalID
            slug
            liveStartAt
            endAt
            registrationEndsAt
            ...SaleHeader_sale
            ...RegisterToBidButton_sale
          }
          me {
            ...SaleArtworksRail_me
            ...SaleActiveBids_me @arguments(saleID: $saleID)
            ...RegisterToBidButton_me @arguments(saleID: $saleID)
          }
          ...SaleLotsList_saleArtworksConnection @arguments(saleID: "sale-slug")
        }
      `}
      variables={{ saleID: "sale-id" }}
      render={({ props }) => {
        if (props) {
          return <Sale queryRes={props} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it("switches to live auction view when sale goes live", () => {
    renderWithWrappers(<TestRenderer />)

    __appStoreTestUtils__?.injectState({
      native: {
        sessionState: { predictionURL: "https://live-staging.artsy.net" },
      },
    })

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "live-sale-slug",
          startAt: moment().subtract(1, "day").toISOString(),
          liveStartAt: moment().subtract(1, "second").toISOString(),
          endAt: moment().add(1, "day").toISOString(),
          timeZone: "Europe/Berlin",
          coverImage: {
            url: "cover image url",
          },
          name: "sale name",
          internalID: "the-sale-internal",
        }),
      })
    )

    expect(navigate).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(1000)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/live-sale-slug")
    expect(popParentViewController).toHaveBeenCalledTimes(1)
  })

  it("switches to live auction view when sale goes live with no endAt", () => {
    renderWithWrappers(<TestRenderer />)

    __appStoreTestUtils__?.injectState({
      native: {
        sessionState: { predictionURL: "https://live-staging.artsy.net" },
      },
    })

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "live-sale-slug",
          startAt: moment().subtract(1, "day").toISOString(),
          liveStartAt: moment().subtract(1, "second").toISOString(),
          endAt: null,
          timeZone: "Europe/Berlin",
          coverImage: {
            url: "cover image url",
          },
          name: "sale name",
          internalID: "the-sale-internal",
        }),
      })
    )

    expect(navigate).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(1000)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/live-sale-slug")
    expect(popParentViewController).toHaveBeenCalledTimes(1)
  })

  it("doesn't switch to live auction view when sale is closed", () => {
    renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "closed-sale-slug",
          startAt: moment().subtract(2, "days").toISOString(),
          liveStartAt: moment().subtract(2, "days").toISOString(),
          endAt: moment().subtract(1, "day").toISOString(),
          timeZone: "Europe/Berlin",
          name: "closed!",
        }),
      })
    )

    expect(navigate).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(1000)
    expect(navigate).toHaveBeenCalledTimes(0)
    expect(popParentViewController).toHaveBeenCalledTimes(0)
  })

  it("renders a Register button when registrations are open", () => {
    const tree = renderWithWrappers(<TestRenderer />).root

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "regular-sale-slug",
          startAt: moment().add(1, "day").toISOString(),
          liveStartAt: moment().add(2, "days").toISOString(),
          endAt: moment().add(3, "days").toISOString(),
          registrationEndsAt: moment().add(3, "hours").toISOString(),
          name: "regular sale!",
        }),
      })
    )

    expect(tree.findAllByType(RegisterToBidButtonContainer)).toHaveLength(1)
  })

  it("doesn't render a Register button when registrations ended", () => {
    const tree = renderWithWrappers(<TestRenderer />).root

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "reg-ended-sale-slug",
          startAt: moment().subtract(3, "days").toISOString(),
          liveStartAt: moment().subtract(2, "days").toISOString(),
          endAt: moment().add(3, "days").toISOString(),
          registrationEndsAt: moment().subtract(3, "hours").toISOString(),
          name: "reg ended sale!",
        }),
      })
    )

    expect(tree.findAllByType(RegisterToBidButtonContainer)).toHaveLength(0)
  })

  it("doesn't render a Register button when it's closed", () => {
    const tree = renderWithWrappers(<TestRenderer />).root

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "closed-sale-slug",
          startAt: moment().subtract(3, "days").toISOString(),
          liveStartAt: moment().subtract(2, "days").toISOString(),
          endAt: moment().subtract(1, "day").toISOString(),
          name: "closed sale!",
        }),
      })
    )

    expect(tree.findAllByType(RegisterToBidButtonContainer)).toHaveLength(0)
  })
})
