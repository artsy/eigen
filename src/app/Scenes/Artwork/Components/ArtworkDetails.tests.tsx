import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkDetails_artwork_TestQuery } from "__generated__/ArtworkDetails_artwork_TestQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkDetails } from "./ArtworkDetails"

jest.unmock("react-relay")

describe("ArtworkDetails", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkDetails_artwork_TestQuery>(
      graphql`
        query ArtworkDetails_artwork_TestQuery @relay_test_operation {
          artwork(id: "four-pence-coins-david-lynch") {
            ...ArtworkDetails_artwork
          }
        }
      `,
      {}
    )

    return <ArtworkDetails artwork={data.artwork!} />
  }

  it("renders all data correctly", async () => {
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {})
    await flushPromiseQueue()

    expect(screen.queryByText("Medium")).toBeTruthy()
    expect(screen.queryByText("Materials")).toBeTruthy()
    expect(screen.queryByText("Size")).toBeTruthy()
    expect(screen.queryByText("Rarity")).toBeTruthy()
    expect(screen.queryByText("Edition")).toBeTruthy()
    expect(screen.queryByText("Certificate of Authenticity")).toBeTruthy()
    expect(screen.queryByText("Condition")).toBeTruthy()
    expect(screen.queryByText("Frame")).toBeTruthy()
    expect(screen.queryByText("Signature")).toBeTruthy()
    expect(screen.queryByText("Series")).toBeTruthy()
    expect(screen.queryByText("Publisher")).toBeTruthy()
    expect(screen.queryByText("Manufacturer")).toBeTruthy()
    expect(screen.queryByText("Image rights")).toBeTruthy()
  })

  it("doesn't render fields that are null or empty string", async () => {
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        framed: {
          details: "",
        },
        publisher: null,
        manufacturer: null,
      }),
    })
    await flushPromiseQueue()

    expect(screen.queryByText("Medium")).toBeTruthy()
    expect(screen.queryByText("Materials")).toBeTruthy()
    expect(screen.queryByText("Size")).toBeTruthy()
    expect(screen.queryByText("Rarity")).toBeTruthy()
    expect(screen.queryByText("Edition")).toBeTruthy()
    expect(screen.queryByText("Certificate of Authenticity")).toBeTruthy()
    expect(screen.queryByText("Condition")).toBeTruthy()

    expect(screen.queryByText("Signature")).toBeTruthy()
    expect(screen.queryByText("Series")).toBeTruthy()

    expect(screen.queryByText("Image rights")).toBeTruthy()

    expect(screen.queryByText("Frame")).toBeNull()
    expect(screen.queryByText("Publisher")).toBeNull()
    expect(screen.queryByText("Manufacturer")).toBeNull()
  })

  it("navigates to medium info modal when tapped", async () => {
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {})
    await flushPromiseQueue()

    fireEvent.press(screen.getByText("name-1"))

    expect(navigate).toHaveBeenCalledWith("/artwork/slug-1/medium", { modal: true })
  })

  it("navigates to artwork classifications modal when tapped", async () => {
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {})
    await flushPromiseQueue()

    fireEvent.press(screen.getByText("attributionClass.name-1"))

    expect(navigate).toHaveBeenCalledWith("/artwork-classifications", { modal: true })
  })

  it("navigates to artwork certificate of authenticity modal when tapped", async () => {
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {})
    await flushPromiseQueue()

    fireEvent.press(screen.getByText("details-1"))

    expect(navigate).toHaveBeenCalledWith("/artwork-certificate-of-authenticity", { modal: true })
  })

  it("should not render condition report button when canRequestLotConditionsReport false", async () => {
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        canRequestLotConditionsReport: false,
      }),
    })

    await flushPromiseQueue()

    expect(screen.queryByText("conditionDescription.details-1")).toBeTruthy()
  })
})
