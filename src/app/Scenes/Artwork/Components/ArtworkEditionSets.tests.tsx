import { fireEvent } from "@testing-library/react-native"
import { ArtworkEditionSets_Test_Query } from "__generated__/ArtworkEditionSets_Test_Query.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtworkEditionSetsFragmentContainer as ArtworkEditionSets } from "./ArtworkEditionSets"

describe("ArtworkEditionSets", () => {
  const onSelectEditionMock = jest.fn()

  const { renderWithRelay } = setupTestWrapper<ArtworkEditionSets_Test_Query>({
    Component: (props) => {
      if (props?.artwork) {
        return <ArtworkEditionSets artwork={props.artwork} onSelectEdition={onSelectEditionMock} />
      }

      return null
    },
    query: graphql`
      query ArtworkEditionSets_Test_Query @relay_test_operation {
        artwork(id: "artworkID") {
          ...ArtworkEditionSets_artwork
        }
      }
    `,
  })

  it("should render all edition sets", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => artwork,
    })

    expect(getByText("Edition Set One")).toBeTruthy()
    expect(getByText("Edition Set Two")).toBeTruthy()
  })

  it("should call `onSelectEdition` handler with the selected edition set id", () => {
    const { getByText } = renderWithRelay({
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
