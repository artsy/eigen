import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollectionArtworkMeta_artwork } from "__generated__/MyCollectionArtworkMeta_artwork.graphql"
import { MyCollectionArtworkMetaTestsQuery } from "__generated__/MyCollectionArtworkMetaTestsQuery.graphql"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { navigate } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkMetaFragmentContainer } from "./MyCollectionArtworkMeta"

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
          return (
            <MyCollectionArtworkMetaFragmentContainer
              artwork={props.artwork}
              viewAll={passedProps.viewAll}
            />
          )
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const sharedArtworkProps: Omit<MyCollectionArtworkMeta_artwork, " $refType"> = {
    slug: "some-slug",
    artistNames: "some-artist-name",
    category: "Painting",
    pricePaid: {
      display: "$200",
    },
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
        expect(text).toContain("$200")
      })

      it("navigates to artwork details and passes props on button click", () => {
        const wrapper = renderWithWrappers(<TestRenderer viewAll={false} />)
        resolveData()
        wrapper.root.findByType(CaretButton).props.onPress()
        expect(navigate).toHaveBeenCalledWith("/my-collection/artwork-details/some-internal-id")
      })
    })

    describe("large version", () => {
      it("renders correct fields", () => {
        const wrapper = renderWithWrappers(<TestRenderer viewAll />)
        resolveData()

        const text = extractText(wrapper.root)
        expect(text).toContain("Artist")
        expect(text).toContain("some-artist-name")
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
        expect(text).toContain("$200")
      })
    })
  })

  describe("analytics", () => {
    it("tracks taps on `View more`", () => {
      const wrapper = renderWithWrappers(<TestRenderer viewAll={false} />)
      resolveData()
      wrapper.root.findByType(CaretButton).props.onPress()
      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: ActionType.tappedShowMore,
        context_module: ContextModule.artworkMetadata,
        context_screen_owner_type: OwnerType.myCollectionArtwork,
        context_screen_owner_id: "some-internal-id",
        context_screen_owner_slug: "some-slug",
        subject: "View more",
      })
    })
  })
})
