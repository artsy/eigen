import { waitFor } from "@testing-library/react-native"
import { navigate, popParentViewController } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { DateTime } from "luxon"
import React, { Suspense } from "react"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { RegisterToBidButtonContainer } from "./Components/RegisterToBidButton"
import { SaleQueryRenderer } from "./Sale"

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
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: false })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("switches to live auction view when sale goes live", () => {
    renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "live-sale-slug",
          startAt: DateTime.now().minus({ day: 1 }).toISO(),
          liveStartAt: DateTime.now().minus({ second: 1 }).toISO(),
          endAt: DateTime.now().plus({ day: 1 }).toISO(),
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
    waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/live-sale-slug")
      expect(popParentViewController).toHaveBeenCalledTimes(1)
    })
  })

  it("switches to live auction view when sale goes live with no endAt", () => {
    renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "live-sale-slug",
          startAt: DateTime.now().minus({ day: 1 }).toISO(),
          liveStartAt: DateTime.now().minus({ second: 1 }).toISO(),
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

    waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/live-sale-slug")
      expect(popParentViewController).toHaveBeenCalledTimes(1)
    })
  })

  it("doesn't switch to live auction view when sale is closed", () => {
    renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "closed-sale-slug",
          startAt: DateTime.now().minus({ days: 2 }).toISO(),
          liveStartAt: DateTime.now().minus({ days: 2 }).toISO(),
          endAt: DateTime.now().minus({ day: 1 }).toISO(),
          timeZone: "Europe/Berlin",
          name: "closed!",
        }),
      })
    )

    expect(navigate).toHaveBeenCalledTimes(0)

    waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(0)
      expect(popParentViewController).toHaveBeenCalledTimes(0)
    })
  })

  it("renders a Register button when registrations are open", () => {
    const tree = renderWithWrappers(<TestRenderer />).root

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "regular-sale-slug",
          startAt: DateTime.now().plus({ day: 1 }).toISO(),
          liveStartAt: DateTime.now().plus({ days: 2 }).toISO(),
          endAt: DateTime.now().plus({ days: 3 }).toISO(),
          registrationEndsAt: DateTime.now().plus({ hours: 3 }).toISO(),
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
          startAt: DateTime.now().minus({ days: 3 }).toISO(),
          liveStartAt: DateTime.now().minus({ days: 2 }).toISO(),
          endAt: DateTime.now().plus({ days: 3 }).toISO(),
          registrationEndsAt: DateTime.now().minus({ hours: 3 }).toISO(),
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
          startAt: DateTime.now().minus({ days: 3 }).toISO(),
          liveStartAt: DateTime.now().minus({ days: 2 }).toISO(),
          endAt: DateTime.now().minus({ day: 1 }).toISO(),
          name: "closed sale!",
        }),
      })
    )

    expect(tree.findAllByType(RegisterToBidButtonContainer)).toHaveLength(0)
  })
})
