import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionWhySellTestsQuery } from "__generated__/MyCollectionWhySellTestsQuery.graphql"
import { GlobalStore, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionWhySell } from "./MyCollectionWhySell"

describe("MyCollectionWhySell", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = ({
    contextModule = "insights",
  }: {
    contextModule: "insights" | "about" | "oldAbout"
  }) => (
    <QueryRenderer<MyCollectionWhySellTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionWhySellTestsQuery @relay_test_operation {
          artwork(id: "some-id") {
            ...MyCollectionWhySell_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionWhySell artwork={props.artwork} contextModule={contextModule} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    GlobalStore.actions.artworkSubmission.submission.initializeArtworkDetailsForm = jest.fn() as any
  })

  const resolveData = (resolvers = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, resolvers)
    )
  }

  describe("P1", () => {
    // P1 related tests
    describe("Artwork without submission", () => {
      describe("Navigation", () => {
        beforeEach(() => {
          __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewSubmissionFlow: false })
        })
        it("navigates to the sale form when Submit for Sale is pressed", () => {
          renderWithWrappers(<TestRenderer contextModule="insights" />)

          resolveData({
            Artwork: () => artworkWithoutSubmission,
          })
          const button = screen.getByTestId("submitArtworkToSellButton")

          fireEvent.press(button)
          expect(navigate).toBeCalledWith("/sell/submissions/new")
        })

        it("navigates to the explanatory page when learn more is press", () => {
          renderWithWrappers(<TestRenderer contextModule="insights" />)

          resolveData({
            Artwork: () => artworkWithoutSubmission,
          })
          const button = screen.getByTestId("learnMoreLink")
          fireEvent.press(button)
          expect(navigate).toBeCalledWith("/selling-with-artsy")
        })
      })

      describe("Analytics", () => {
        it("tracks events, oldAbout section", async () => {
          renderWithWrappers(<TestRenderer contextModule="oldAbout" />)
          resolveData({
            Artwork: () => artworkWithoutSubmission,
          })
          const button = screen.getByTestId("submitArtworkToSellButton")

          fireEvent.press(button)
          await flushPromiseQueue()

          expect(mockTrackEvent).toHaveBeenCalled()
          expect(mockTrackEvent).toHaveBeenCalledWith({
            action: "tappedSellArtwork",
            context_module: "sellFooter",
            context_screen_owner_type: "myCollectionArtwork",
            context_screen_owner_id: "someInternalId",
            context_screen_owner_slug: "someSlug",
            subject: "Submit This Artwork to Sell",
          })
        })

        it("tracks events, about tab", async () => {
          renderWithWrappers(<TestRenderer contextModule="about" />)
          resolveData({
            Artwork: () => artworkWithoutSubmission,
          })
          const button = screen.getByTestId("submitArtworkToSellButton")
          fireEvent.press(button)
          await flushPromiseQueue()
          expect(mockTrackEvent).toHaveBeenCalled()

          expect(mockTrackEvent).toHaveBeenCalledWith({
            action: "tappedSellArtwork",
            context_module: "myCollectionArtworkAbout",
            context_screen: "myCollectionArtworkAbout",
            context_screen_owner_type: "myCollectionArtwork",
            context_screen_owner_id: "someInternalId",
            context_screen_owner_slug: "someSlug",
            subject: "Submit This Artwork to Sell",
          })
        })

        it("tracks events, insights tab", async () => {
          renderWithWrappers(<TestRenderer contextModule="insights" />)
          resolveData({
            Artwork: () => artworkWithoutSubmission,
          })
          const button = screen.getByTestId("submitArtworkToSellButton")
          fireEvent.press(button)
          await flushPromiseQueue()
          expect(mockTrackEvent).toHaveBeenCalled()

          expect(mockTrackEvent).toHaveBeenCalledWith({
            action: "tappedSellArtwork",
            context_module: "myCollectionArtworkInsights",
            context_screen: "myCollectionArtworkInsights",
            context_screen_owner_type: "myCollectionArtwork",
            context_screen_owner_id: "someInternalId",
            context_screen_owner_slug: "someSlug",
            subject: "Submit This Artwork to Sell",
          })
        })
      })
    })

    describe("Behavior", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewSubmissionFlow: false })
      })
      it("initializes the submission form", async () => {
        renderWithWrappers(<TestRenderer contextModule="oldAbout" />)
        resolveData({
          Artwork: () => artworkWithoutSubmission,
        })
        const button = screen.getByTestId("submitArtworkToSellButton")

        fireEvent.press(button)

        await flushPromiseQueue()

        expect(
          GlobalStore.actions.artworkSubmission.submission.initializeArtworkDetailsForm
        ).toHaveBeenCalledWith({
          artist: "Banksy",
          artistId: "4dd1584de0091e000100207c",
          attributionClass: "UNIQUE",
          category: null,
          depth: "13",
          dimensionsMetric: "cm",
          editionNumber: "11",
          editionSizeFormatted: "12",
          height: "12",
          medium: "Photography",
          provenance: "The Provenance",
          title: "Welcome Mat",
          width: "13",
          year: "2019",
          source: "MY_COLLECTION",
          myCollectionArtworkID: "someInternalId",
        })

        expect(navigate).toHaveBeenCalledWith("/sell/submissions/new")
      })
    })
  })

  describe("not P1 ", () => {
    it("doesn't render the form if not P1", () => {
      renderWithWrappers(<TestRenderer contextModule="oldAbout" />)
      resolveData({
        Artwork: () => notP1Artist,
      })
      const button = screen.queryAllByTestId("submitArtworkToSellButton")
      expect(button).toHaveLength(0)
    })
  })
  describe("Artwork without submission ", () => {
    it("doesn't render the form if submission exists", () => {
      renderWithWrappers(<TestRenderer contextModule="oldAbout" />)
      resolveData({
        Artwork: () => artworkWithSubmission,
      })
      const button = screen.queryAllByTestId("submitArtworkToSellButton")
      expect(button).toHaveLength(0)
    })
  })
})

const artworkWithoutSubmission = {
  slug: "someSlug",
  internalID: "someInternalId",
  artist: {
    name: "Banksy",
    targetSupply: { isP1: true },
    internalID: "4dd1584de0091e000100207c",
  },
  submissionId: null,
  attributionClass: { name: "Unique" },
  depth: "13",
  metric: "cm",
  editionNumber: "11",
  editionSize: "12",
  height: "12",
  medium: "Photography",
  provenance: "The Provenance",
  title: "Welcome Mat",
  width: "13",
  date: "2019",
}

const notP1Artist = {
  slug: "someSlug",
  internalID: "someInternalId",
  artist: {
    name: "Daria",
    targetSupply: { isP1: false },
    internalID: "4dd1584de0091e000100207c",
  },
}

const artworkWithSubmission = {
  slug: "someSlug",
  internalID: "someInternalId",
  submissionId: "someId",
}
