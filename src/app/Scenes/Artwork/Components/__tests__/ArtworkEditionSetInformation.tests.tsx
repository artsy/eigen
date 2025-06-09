import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkEditionSetInformation_Test_Query } from "__generated__/ArtworkEditionSetInformation_Test_Query.graphql"
import { ArtworkStore, ArtworkStoreProvider, artworkModel } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkEditionSetInformationFragmentContainer as ArtworkEditionSetInformation } from "app/Scenes/Artwork/Components/ArtworkEditionSetInformation"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkEditionSetInformation", () => {
  const ArtworkStoreDebug = () => {
    const artworkState = ArtworkStore.useStoreState((state) => state)

    return <Text testID="debug">{JSON.stringify(artworkState)}</Text>
  }

  const { renderWithRelay } = setupTestWrapper<ArtworkEditionSetInformation_Test_Query>({
    Component: (props) => {
      return (
        <ArtworkStoreProvider
          runtimeModel={{
            ...artworkModel,
            selectedEditionId: artwork.editionSets[0].internalID,
          }}
        >
          <ArtworkEditionSetInformation artwork={props.artwork!} />
          <ArtworkStoreDebug />
        </ArtworkStoreProvider>
      )
    },
    query: graphql`
      query ArtworkEditionSetInformation_Test_Query @relay_test_operation {
        artwork(id: "artworkID") {
          ...ArtworkEditionSetInformation_artwork
        }
      }
    `,
  })

  it("the sale message for the selected edition set should NOT be rendered", () => {
    renderWithRelay({ Artwork: () => artwork })

    expect(screen.queryByLabelText("Selected edition set")).not.toBeOnTheScreen()
  })

  it("should keep the selected edtion set id in artwork store", () => {
    renderWithRelay({ Artwork: () => artwork })

    fireEvent.press(screen.getByText("Edition Set Two"))

    const artworkStateRaw = extractText(screen.getByTestId("debug"))
    const artworkState = JSON.parse(artworkStateRaw)

    expect(artworkState.selectedEditionId).toBe("edition-set-two")
  })
})

const artwork = {
  editionSets: [
    {
      internalID: "edition-set-one",
      editionOf: "Edition Set One",
      saleMessage: "$1000",
      isAcquireable: true,
      isOfferable: true,
    },
    {
      internalID: "edition-set-two",
      editionOf: "Edition Set Two",
      saleMessage: "$2000",
      isAcquireable: true,
      isOfferable: true,
    },
  ],
}
