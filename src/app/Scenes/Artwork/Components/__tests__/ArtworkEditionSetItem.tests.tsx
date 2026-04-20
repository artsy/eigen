import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkEditionSetItem_Test_Query } from "__generated__/ArtworkEditionSetItem_Test_Query.graphql"
import { ArtworkEditionSetItemFragmentContainer as ArtworkEditionSetItem } from "app/Scenes/Artwork/Components/ArtworkEditionSetItem"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkEditionSetItem", () => {
  const onSelectEditionMock = jest.fn()

  const { renderWithRelay } = setupTestWrapper<ArtworkEditionSetItem_Test_Query>({
    Component: (props) => {
      const firstEditionSet = props.artwork!.editionSets![0]!

      return (
        <ArtworkEditionSetItem
          item={firstEditionSet}
          isSelected={false}
          onPress={onSelectEditionMock}
          {...props}
        />
      )
    },
    query: graphql`
      query ArtworkEditionSetItem_Test_Query {
        artwork(id: "artworkID") {
          editionSets {
            ...ArtworkEditionSetItem_item
          }
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: false })
  })

  describe("Dimensions", () => {
    it("display dimension in inches when if it is selected as the preferred metric", () => {
      __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "in" } })

      renderWithRelay({ Artwork: () => artwork })

      expect(screen.getByText("10 x 10 in")).toBeOnTheScreen()
      expect(screen.queryByText("15 x 15 cm")).not.toBeOnTheScreen()
    })

    it("display dimension in centimeters when if it is selected as the preferred metric", () => {
      __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "cm" } })

      renderWithRelay({
        Artwork: () => artwork,
      })

      expect(screen.getByText("15 x 15 cm")).toBeOnTheScreen()
      expect(screen.queryByText("10 x 10 in")).not.toBeOnTheScreen()
    })

    it("display the first available dimension", () => {
      __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "cm" } })

      renderWithRelay({
        Artwork: () => ({
          editionSets: [
            {
              ...editionSet,
              dimensions: { ...editionSet.dimensions, cm: null },
            },
          ],
        }),
      })

      expect(screen.getByText("10 x 10 in")).toBeOnTheScreen()
      expect(screen.queryByText("15 x 15 cm")).not.toBeOnTheScreen()
    })
  })

  describe("OnPress", () => {
    it("should call `onPress` handler with the selected edition set id", () => {
      renderWithRelay({ Artwork: () => artwork })

      fireEvent.press(screen.getByText("Edition Set One"))

      expect(onSelectEditionMock).toBeCalledWith("edition-set-one")
    })

    it("should not call `onPress` handler when is disabled", () => {
      renderWithRelay({ Artwork: () => artwork }, { disabled: true })

      fireEvent.press(screen.getByText("Edition Set One"))

      expect(onSelectEditionMock).not.toBeCalledWith("edition-set-one")
    })
  })

  describe("with AREnableArtworksFramedSize feature flag enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })
    })

    it("displays framed dimension with 'with frame included' text when framed dimensions exist", () => {
      __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "in" } })

      renderWithRelay({
        Artwork: () => ({
          editionSets: [
            { ...editionSet, framedDimensions: { in: "14 x 14 in", cm: "20 x 20 cm" } },
          ],
        }),
      })

      expect(screen.getByText("14 x 14 in with frame included")).toBeOnTheScreen()
      expect(screen.queryByText("10 x 10 in")).not.toBeOnTheScreen()
    })

    it("displays framed dimension in cm when selected as preferred metric", () => {
      __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "cm" } })

      renderWithRelay({
        Artwork: () => ({
          editionSets: [
            {
              ...editionSet,
              framedDimensions: { in: "14 x 14 in", cm: "20 x 20 cm" },
            },
          ],
        }),
      })

      expect(screen.getByText("20 x 20 cm with frame included")).toBeOnTheScreen()
      expect(screen.queryByText("15 x 15 cm")).not.toBeOnTheScreen()
    })

    it("falls back to regular dimensions when no framed dimensions", () => {
      __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "in" } })

      renderWithRelay({ Artwork: () => artwork })

      expect(screen.getByText("10 x 10 in")).toBeOnTheScreen()
      expect(screen.queryByText("with frame included")).not.toBeOnTheScreen()
    })
  })
})

const editionSet = {
  internalID: "edition-set-one",
  editionOf: "Edition Set One",
  saleMessage: "$1000",
  dimensions: { in: "10 x 10 in", cm: "15 x 15 cm" },
  framedDimensions: null,
}

const artwork = {
  editionSets: [editionSet],
}
