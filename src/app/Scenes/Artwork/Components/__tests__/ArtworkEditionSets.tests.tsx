import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkEditionSets_Test_Query } from "__generated__/ArtworkEditionSets_Test_Query.graphql"
import { ArtworkEditionSetsFragmentContainer as ArtworkEditionSets } from "app/Scenes/Artwork/Components/ArtworkEditionSets"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkEditionSets", () => {
  const onSelectEditionMock = jest.fn()

  const { renderWithRelay } = setupTestWrapper<ArtworkEditionSets_Test_Query>({
    Component: (props) => (
      <ArtworkEditionSets artwork={props.artwork!} onSelectEdition={onSelectEditionMock} />
    ),
    query: graphql`
      query ArtworkEditionSets_Test_Query @relay_test_operation {
        artwork(id: "artworkID") {
          ...ArtworkEditionSets_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render all edition sets", () => {
    renderWithRelay({ Artwork: () => artwork })

    expect(screen.getByText("Edition Set One")).toBeOnTheScreen()
    expect(screen.getByText("Edition Set Two")).toBeOnTheScreen()
    expect(screen.getByText("Edition Set Three")).toBeOnTheScreen()

    // pre-selecting the first ecommerce enabled edition set
    expect(onSelectEditionMock).toBeCalledWith("edition-set-two")
  })

  it("should call `onSelectEdition` handler with the selected edition set id if acquireable or offerable", () => {
    renderWithRelay({ Artwork: () => artwork })

    fireEvent.press(screen.getByText("Edition Set Three"))

    expect(onSelectEditionMock).toBeCalledWith("edition-set-three")

    fireEvent.press(screen.getByText("Edition Set Two"))

    expect(onSelectEditionMock).toBeCalledWith("edition-set-two")
  })

  it("should not call `onSelectEdition` handler when the edition set is not acquireable or offerable", () => {
    renderWithRelay({ Artwork: () => artwork })

    fireEvent.press(screen.getByText("Edition Set One"))

    expect(onSelectEditionMock).not.toBeCalledWith("edition-set-one")
  })
})

const artwork = {
  editionSets: [
    {
      internalID: "edition-set-one",
      editionOf: "Edition Set One",
      saleMessage: "$1000",
      isAcquireable: false,
      isOfferable: false,
    },
    {
      internalID: "edition-set-two",
      editionOf: "Edition Set Two",
      saleMessage: "$2000",
      isAcquireable: true,
      isisOfferable: false,
    },
    {
      internalID: "edition-set-three",
      editionOf: "Edition Set Three",
      saleMessage: "$3000",
      isAcquireable: false,
      isOfferable: true,
    },
  ],
}
