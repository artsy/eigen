import { fireEvent } from "@testing-library/react-native"
import { ArtworkEditionSets_Test_Query } from "__generated__/ArtworkEditionSets_Test_Query.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkEditionSets } from "./ArtworkEditionSets"

jest.unmock("react-relay")

describe("ArtworkEditionSets", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const onSelectEditionMock = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkEditionSets_Test_Query>(
      graphql`
        query ArtworkEditionSets_Test_Query {
          artwork(id: "artworkID") {
            ...ArtworkEditionSets_artwork
          }
        }
      `,
      {}
    )

    if (data.artwork) {
      return <ArtworkEditionSets artwork={data.artwork} onSelectEdition={onSelectEditionMock} />
    }

    return null
  }

  it("should render all edition sets", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    expect(getByText("Edition Set One")).toBeTruthy()
    expect(getByText("Edition Set Two")).toBeTruthy()
  })

  it("should call `onSelectEdition` handler with the selected edition set id", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    fireEvent.press(getByText("Edition Set Two"))

    expect(onSelectEditionMock).toBeCalledWith("edition-set-two")
  })
})

const artwork = {
  editionSets: [
    {
      internalID: "edition-set-one",
      editionOf: "Edition Set One",
      saleMessage: "$1000",
    },
    {
      internalID: "edition-set-two",
      editionOf: "Edition Set Two",
      saleMessage: "$2000",
    },
  ],
}
