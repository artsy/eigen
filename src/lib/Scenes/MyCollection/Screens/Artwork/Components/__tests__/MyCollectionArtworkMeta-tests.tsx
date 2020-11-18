import { MyCollectionArtworkMeta_artwork } from "__generated__/MyCollectionArtworkMeta_artwork.graphql"
import { MyCollectionArtworkMetaTestsQuery } from "__generated__/MyCollectionArtworkMetaTestsQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkMetaFragmentContainer } from "../MyCollectionArtworkMeta"

jest.unmock("react-relay")

describe("MyCollectionArtworkMeta", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = (passedProps: { viewAll: boolean }) => (
    <QueryRenderer<MyCollectionArtworkMetaTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkMetaTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtworkMeta_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkMetaFragmentContainer artwork={props.artwork} viewAll={passedProps.viewAll} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const sharedArtworkProps: Omit<MyCollectionArtworkMeta_artwork, " $refType"> = {
    artistNames: "some artist name",
    category: "Painting",
    costMinor: 200,
    costCurrencyCode: "USD",
    date: "Jan 20th",
    editionSize: "10x10x10",
    editionNumber: "1",
    height: "20",
    width: "30",
    depth: "40",
    internalID: "some-internal-id",
    medium: "oil",
    metric: "in",
    title: "some title",
  }

  const resolveData = () => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => sharedArtworkProps,
      })
    )
  }

  describe("component states", () => {
    describe("small version", () => {
      it("renders correct fields", () => {
        const wrapper = renderWithWrappers(<TestRenderer viewAll={false} />)
        resolveData()

        const text = extractText(wrapper.root)
        expect(text).toContain("Category")
        expect(text).toContain("Oil")
        expect(text).toContain("Dimension")
        expect(text).toContain("20 × 30 × 40 in")
        expect(text).toContain("Edition size")
        expect(text).toContain("10x10x10")
        expect(text).toContain("Edition number")
        expect(text).toContain("1")
        expect(text).toContain("Price paid")
        expect(text).toContain("200 USD")
      })

      it("navigates to artwork details and passes props on button click", () => {
        const wrapper = renderWithWrappers(<TestRenderer viewAll={false} />)
        resolveData()
        wrapper.root.findByType(CaretButton).props.onPress()
        expect(navigate).toHaveBeenCalledWith("/my-collection/artwork-details/some-internal-id", {
          passProps: {
            artwork: sharedArtworkProps,
          },
        })
      })
    })

    describe("large version", () => {
      it("renders correct fields", () => {
        const wrapper = renderWithWrappers(<TestRenderer viewAll />)
        resolveData()

        const text = extractText(wrapper.root)
        expect(text).toContain("Artist")
        expect(text).toContain("some artist name")
        expect(text).toContain("Title")
        expect(text).toContain("some title")
        expect(text).toContain("Year created")
        expect(text).toContain("Jan 20th")
        expect(text).toContain("Category")
        expect(text).toContain("Oil")
        expect(text).toContain("Materials")
        expect(text).toContain("Painting")
        expect(text).toContain("Dimension")
        expect(text).toContain("20 × 30 × 40 in")
        expect(text).toContain("Edition size")
        expect(text).toContain("10x10x10")
        expect(text).toContain("Edition number")
        expect(text).toContain("1")
        expect(text).toContain("Price paid")
        expect(text).toContain("200 USD")
      })
    })
  })
})
