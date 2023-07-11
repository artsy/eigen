import { ModalStack } from "app/system/navigation/ModalStack"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { postEventToProviders } from "app/utils/track/providers"
import { isEqual } from "lodash"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistQueryRenderer } from "./Artist"

jest.unmock("react-tracking")

type ArtistQueries = "ArtistAboveTheFoldQuery" | "ArtistBelowTheFoldQuery"

describe("Artist", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  function mockMostRecentOperation(name: ArtistQueries, mockResolvers: MockResolvers = {}) {
    expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ID({ path }) {
          // need to make sure artist id is stable between above-and-below-the-fold queries to avoid cache weirdness
          if (isEqual(path, ["artist", "id"])) {
            return "artist-id"
          }
        },
        ...mockResolvers,
      })
      return result
    })
  }

  const TestWrapper = (props: Record<string, any>) => (
    <ModalStack>
      <ArtistQueryRenderer
        artistID="ignored"
        environment={mockEnvironment as unknown as RelayModernEnvironment}
        {...props}
      />
    </ModalStack>
  )

  it("returns an empty state if artist has no artworks", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestWrapper />)
    const emptyTitle = "Get notified when new works are available"
    const emptyMessage =
      "There are currently no works for sale for this artist. Create an alert, and we’ll let you know when new works are added."

    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          statuses: {
            artworks: false,
          },
        }
      },
    })

    expect(getByText(emptyTitle)).toBeTruthy()
    expect(getByText(emptyMessage)).toBeTruthy()
  })

  it("should render all tabs", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestWrapper />)

    expect(queryByText("Artworks")).toBeTruthy()
    expect(queryByText("Auction Results")).toBeTruthy()
    expect(queryByText("About")).toBeTruthy()
  })

  it("tracks a page view", async () => {
    renderWithHookWrappersTL(<TestWrapper />)

    mockMostRecentOperation("ArtistAboveTheFoldQuery")

    await flushPromiseQueue()

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, {
      context_screen: "Artist",
      context_screen_owner_id: '<mock-value-for-field-"internalID">',
      context_screen_owner_slug: '<mock-value-for-field-"slug">',
      context_screen_owner_type: "Artist",
    })
  })
})
