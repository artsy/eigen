import { navigate, popParentViewController } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import moment from "moment"
import React, { Suspense } from "react"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { RegisterToBidButtonContainer } from "../Components/RegisterToBidButton"
import { SaleQueryRenderer } from "../Sale"

jest.unmock("react-relay")

jest.mock("lib/navigation/navigate", () => ({
  popParentViewController: jest.fn(),
  navigate: jest.fn(),
}))

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  reset(this: { defaultEnvironment: any }) {
    this.defaultEnvironment = require("relay-test-utils").createMockEnvironment()
  },
}))

describe("Sale", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <Suspense fallback={() => null}>
      <SaleQueryRenderer saleID="sale-id" environment={mockEnvironment} />
    </Suspense>
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
