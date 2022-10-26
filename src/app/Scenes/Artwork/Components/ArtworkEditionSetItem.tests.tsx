import { fireEvent } from "@testing-library/react-native"
import { ArtworkEditionSetItem_Test_Query } from "__generated__/ArtworkEditionSetItem_Test_Query.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkEditionSetItem } from "./ArtworkEditionSetItem"

jest.unmock("react-relay")

describe("ArtworkEditionSetItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const onSelectEditionMock = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkEditionSetItem_Test_Query>(
      graphql`
        query ArtworkEditionSetItem_Test_Query {
          artwork(id: "artworkID") {
            editionSets {
              ...ArtworkEditionSetItem_item
            }
          }
        }
      `,
      {}
    )

    const editionSets = data.artwork?.editionSets ?? []
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
  }

  describe("Dimensions", () => {
    it("display dimension in inches when if it is selected as the preferred metric", async () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          metric: "in",
        },
      })

      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()

      expect(queryByText("15 x 15 cm")).toBeNull()
      expect(queryByText("10 x 10 in")).toBeTruthy()
    })

    it("display dimension in centimeters when if it is selected as the preferred metric", async () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          metric: "cm",
        },
      })

      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()

      expect(queryByText("10 x 10 in")).toBeNull()
      expect(queryByText("15 x 15 cm")).toBeTruthy()
    })

    it("display the first available dimension", async () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          metric: "cm",
        },
      })

      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

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
      await flushPromiseQueue()

      expect(queryByText("15 x 15 cm")).toBeNull()
      expect(queryByText("10 x 10 in")).toBeTruthy()
    })
  })

  it("should call `onPress` handler with the selected edition set id", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

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
