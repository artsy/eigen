import { waitFor } from "@testing-library/react-native"
import { CascadingEndTimesBanner } from "app/Scenes/Artwork/Components/CascadingEndTimesBanner"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { DateTime } from "luxon"
import { Suspense } from "react"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"
import { RegisterToBidButtonContainer } from "./Components/RegisterToBidButton"
import { SaleQueryRenderer } from "./Sale"

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
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
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("switches to live auction view when sale goes live", async () => {
    renderWithWrappersLEGACY(<TestRenderer />)
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
    await waitFor(() => expect(navigate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/live-sale-slug", {
        replaceActiveModal: true,
        replaceActiveScreen: true,
      })
    )
  })

  it("switches to live auction view when sale goes live with no endAt", async () => {
    renderWithWrappersLEGACY(<TestRenderer />)
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
    await waitFor(() => expect(navigate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/live-sale-slug", {
        replaceActiveModal: true,
        replaceActiveScreen: true,
      })
    )
  })

  it("doesn't switch to live auction view when sale is closed", async () => {
    renderWithWrappersLEGACY(<TestRenderer />)

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

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(0)
    })
  })

  it("renders a Register button when registrations are open", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root

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
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root

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
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root

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

  it("renders the banner when the sale has cascading end times", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "cascading-sale-slug",
          startAt: DateTime.now().minus({ days: 3 }).toISO(),
          liveStartAt: DateTime.now().minus({ days: 2 }).toISO(),
          endAt: DateTime.now().plus({ day: 1 }).toISO(),
          name: "Cascading Sale",
          cascadingEndTimeIntervalMinutes: 1,
          isClosed: false,
        }),
      })
    )

    expect(tree.findAllByType(CascadingEndTimesBanner)).toHaveLength(1)
  })

  it("doesn't render the banner when the sale does not have cascading end times", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "non-cascading-sale-slug",
          startAt: DateTime.now().minus({ days: 3 }).toISO(),
          liveStartAt: DateTime.now().minus({ days: 2 }).toISO(),
          endAt: DateTime.now().plus({ day: 1 }).toISO(),
          name: "Non Cascading Sale",
          cascadingEndTimeIntervalMinutes: null,
          isClosed: false,
        }),
      })
    )

    expect(tree.findAllByType(CascadingEndTimesBanner)).toHaveLength(0)
  })

  it("doesn't render the banner when the sale has cascading end times but the sale is closed", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "closed-cascading-sale-slug",
          startAt: DateTime.now().minus({ days: 3 }).toISO(),
          liveStartAt: DateTime.now().minus({ days: 2 }).toISO(),
          endAt: DateTime.now().minus({ day: 1 }).toISO(),
          name: "Closed Cascading Sale",
          cascadingEndTimeIntervalMinutes: 1,
          isClosed: true,
        }),
      })
    )

    expect(tree.findAllByType(CascadingEndTimesBanner)).toHaveLength(0)
  })
})
