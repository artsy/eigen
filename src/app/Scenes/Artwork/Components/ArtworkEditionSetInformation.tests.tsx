import { fireEvent } from "@testing-library/react-native"
import { ArtworkEditionSetInformation_Test_Query } from "__generated__/ArtworkEditionSetInformation_Test_Query.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkEditionSetInformation } from "./ArtworkEditionSetInformation"

jest.unmock("react-relay")

describe("ArtworkEditionSetInformation", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  let selectedEditionId: string
  const onSelectEditionMock = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    selectedEditionId = artwork.editionSets[0].internalID
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkEditionSetInformation_Test_Query>(
      graphql`
        query ArtworkEditionSetInformation_Test_Query {
          artwork(id: "artworkID") {
            ...ArtworkEditionSetInformation_artwork
          }
        }
      `,
      {}
    )

    if (data.artwork) {
      return (
        <ArtworkEditionSetInformation
          artwork={data.artwork}
          selectedEditionId={selectedEditionId}
          onSelectEdition={onSelectEditionMock}
        />
      )
    }

    return null
  }

  it("should correctly render the sale message for the selected edition set", async () => {
    selectedEditionId = artwork.editionSets[1].internalID
    const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    const saleMessageElement = getByLabelText("Selected edition set")
    expect(saleMessageElement).toHaveTextContent("$2000")
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
