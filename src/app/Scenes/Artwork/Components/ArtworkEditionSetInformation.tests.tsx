import { fireEvent } from "@testing-library/react-native"
import { ArtworkEditionSetInformation_Test_Query } from "__generated__/ArtworkEditionSetInformation_Test_Query.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkStoreProvider } from "../ArtworkStore"
import { ArtworkEditionSetInformationFragmentContainer as ArtworkEditionSetInformation } from "./ArtworkEditionSetInformation"

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
    return (
      <QueryRenderer<ArtworkEditionSetInformation_Test_Query>
        environment={mockEnvironment}
        query={graphql`
          query ArtworkEditionSetInformation_Test_Query @relay_test_operation {
            artwork(id: "artworkID") {
              ...ArtworkEditionSetInformation_artwork
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artwork) {
            return (
              <ArtworkStoreProvider>
                <ArtworkEditionSetInformation
                  artwork={props.artwork}
                  selectedEditionId={selectedEditionId}
                  onSelectEdition={onSelectEditionMock}
                />
              </ArtworkStoreProvider>
            )
          }

          return null
        }}
      />
    )
  }

  it("should correctly render the sale message for the selected edition set", () => {
    selectedEditionId = artwork.editionSets[1].internalID
    const { getByLabelText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })

    const saleMessageElement = getByLabelText("Selected edition set")
    expect(saleMessageElement).toHaveTextContent("$2000")
  })

  it("should call `onSelectEdition` handler with the selected edition set id", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })

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
