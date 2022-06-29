import { fireEvent } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkAttributionClassFAQModal } from "./ArtworkAttributionClassFAQModal"

jest.unmock("react-relay")

describe("ArtworkAttributionClassFAQModal", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const onClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockEnvironment = createMockEnvironment()
  })

  it("renders", async () => {
    const { getByText, getAllByText } = renderWithHookWrappersTL(
      <ArtworkAttributionClassFAQModal visible onClose={onClose} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        artworkAttributionClasses: [
          { name: "first", longDescription: "first long description" },
          { name: "second", longDescription: "second long description" },
        ],
      }),
    })

    await flushPromiseQueue()

    expect(getByText("Artwork classifications")).toBeDefined()
    expect(getByText("first")).toBeDefined()
    expect(getByText("first long description")).toBeDefined()
    expect(getByText("second")).toBeDefined()
    expect(getByText("second long description")).toBeDefined()
    expect(getAllByText("OK")[0]).toBeDefined()
  })

  it("calls onClose when clicking the button", async () => {
    const { getAllByText } = renderWithHookWrappersTL(
      <ArtworkAttributionClassFAQModal visible onClose={onClose} />,
      mockEnvironment
    )
    resolveMostRecentRelayOperation(mockEnvironment, {})
    await flushPromiseQueue()

    fireEvent.press(getAllByText("OK")[0])
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
