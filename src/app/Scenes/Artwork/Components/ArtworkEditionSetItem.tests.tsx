import { fireEvent } from "@testing-library/react-native"
import { ArtworkEditionSetItem_Test_Query } from "__generated__/ArtworkEditionSetItem_Test_Query.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkEditionSetItemFragmentContainer as ArtworkEditionSetItem } from "./ArtworkEditionSetItem"


describe("ArtworkEditionSetItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const onSelectEditionMock = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<ArtworkEditionSetItem_Test_Query>
        environment={mockEnvironment}
        query={graphql`
          query ArtworkEditionSetItem_Test_Query {
            artwork(id: "artworkID") {
              editionSets {
                ...ArtworkEditionSetItem_item
              }
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          const editionSets = props?.artwork?.editionSets ?? []
          const firstEditionSet = editionSets[0]

          if (firstEditionSet) {
            return (
              <ArtworkEditionSetItem
                item={firstEditionSet}
                isSelected={false}
                onPress={onSelectEditionMock}
              />
            )
          }

          return null
        }}
      />
    )
  }

  describe("Dimensions", () => {
    it("display dimension in inches when if it is selected as the preferred metric", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          metric: "in",
        },
      })

      const { queryByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      expect(queryByText("15 x 15 cm")).toBeNull()
      expect(queryByText("10 x 10 in")).toBeTruthy()
    })

    it("display dimension in centimeters when if it is selected as the preferred metric", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          metric: "cm",
        },
      })

      const { queryByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      expect(queryByText("10 x 10 in")).toBeNull()
      expect(queryByText("15 x 15 cm")).toBeTruthy()
    })

    it("display the first available dimension", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          metric: "cm",
        },
      })

      const { queryByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          editionSets: [
            {
              ...editionSet,
              dimensions: {
                ...editionSet.dimensions,
                cm: null,
              },
            },
          ],
        }),
      })

      expect(queryByText("15 x 15 cm")).toBeNull()
      expect(queryByText("10 x 10 in")).toBeTruthy()
    })
  })

  it("should call `onPress` handler with the selected edition set id", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })

    fireEvent.press(getByText("Edition Set One"))

    expect(onSelectEditionMock).toBeCalledWith("edition-set-one")
  })
})

const editionSet = {
  internalID: "edition-set-one",
  editionOf: "Edition Set One",
  saleMessage: "$1000",
  dimensions: {
    in: "10 x 10 in",
    cm: "15 x 15 cm",
  },
}

const artwork = {
  editionSets: [editionSet],
}
