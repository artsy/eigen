import { fireEvent } from "@testing-library/react-native"
import { ArtworkEditionSetInformation_Test_Query } from "__generated__/ArtworkEditionSetInformation_Test_Query.graphql"
import { ArtworkStore, ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Text } from "palette"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkEditionSetInformationFragmentContainer as ArtworkEditionSetInformation } from "./ArtworkEditionSetInformation"


describe("ArtworkEditionSetInformation", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const ArtworkStoreDebug = () => {
    const artworkState = ArtworkStore.useStoreState((state) => state)

    return <Text testID="debug">{JSON.stringify(artworkState)}</Text>
  }

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
              <ArtworkStoreProvider
                initialData={{
                  selectedEditionId: artwork.editionSets[0].internalID,
                }}
              >
                <ArtworkEditionSetInformation artwork={props.artwork} />
                <ArtworkStoreDebug />
              </ArtworkStoreProvider>
            )
          }

          return null
        }}
      />
    )
  }

  describe("when ARArtworkRedesingPhase2 feature flag is disabled", () => {
    it("the sale message for the selected edition set should be rendered", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        ARArtworkRedesingPhase2: false,
      })

      const { getByLabelText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      const saleMessageElement = getByLabelText("Selected edition set")
      expect(saleMessageElement).toHaveTextContent("$1000")
    })
  })

  describe("when ARArtworkRedesingPhase2 feature flag is enabled", () => {
    it("the sale message for the selected edition set should NOT be rendered", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        ARArtworkRedesingPhase2: true,
      })

      const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      expect(queryByLabelText("Selected edition set")).toBeNull()
    })
  })

  it("should keep the selected edtion set id in artwork store", () => {
    const { getByText, getByTestId } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })

    fireEvent.press(getByText("Edition Set Two"))

    const artworkStateRaw = extractText(getByTestId("debug"))
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
    },
    {
      internalID: "edition-set-two",
      editionOf: "Edition Set Two",
      saleMessage: "$2000",
    },
  ],
}
