import { fireEvent } from "@testing-library/react-native"
import { ArtworkEditionSets_Test_Query } from "__generated__/ArtworkEditionSets_Test_Query.graphql"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkEditionSetsFragmentContainer as ArtworkEditionSets } from "./ArtworkEditionSets"

jest.unmock("react-relay")

describe("ArtworkEditionSets", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const onSelectEditionMock = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<ArtworkEditionSets_Test_Query>
        environment={mockEnvironment}
        query={graphql`
          query ArtworkEditionSets_Test_Query @relay_test_operation {
            artwork(id: "artworkID") {
              ...ArtworkEditionSets_artwork
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artwork) {
            return (
              <ArtworkEditionSets artwork={props.artwork} onSelectEdition={onSelectEditionMock} />
            )
          }

          return null
        }}
      />
    )
  }

  it("should render all edition sets", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })

    expect(getByText("Edition Set One")).toBeTruthy()
    expect(getByText("Edition Set Two")).toBeTruthy()
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
