import { screen } from "@testing-library/react-native"
import { ShowTestsQuery } from "__generated__/ShowTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { Show, ShowFragmentContainer } from "./Show"

jest.unmock("react-relay")

describe("Show", () => {
  const { renderWithRelay } = setupTestWrapper<ShowTestsQuery>({
    Component: ({ show }) => <ShowFragmentContainer show={show!} />,
    query: graphql`
      query ShowTestsQuery($showID: String!) @relay_test_operation {
        show(id: $showID) {
          ...Show_show
        }
      }
    `,
    variables: {
      showID: "the-big-show",
    },
  })

  it("renders the show", () => {
    renderWithRelay({
      Show: () => ({
        name: "The big show",
        formattedStartAt: "October 23",
        formattedEndAt: "October 27, 2000",
        startAt: "2000-10-23T20:00:00+00:00",
        endAt: "2000-10-27T00:00:00+00:00",
        partner: {
          name: "Example Partner",
        },
      }),
    })

    expect(screen.UNSAFE_queryAllByType(Show)).toHaveLength(1)

    expect(screen.queryByText("The big show")).toBeTruthy()
    expect(screen.queryByText("October 23 – October 27, 2000")).toBeTruthy()
    expect(screen.queryByText("Closed")).toBeTruthy()
    expect(screen.queryByText("Presented by Example Partner")).toBeTruthy()
  })

  it("renders the installation shots", () => {
    renderWithRelay({
      Show: () => ({
        images: [{ caption: "First install shot" }, { caption: "Second install shot" }],
      }),
    })

    expect(screen.queryByText("First install shot")).toBeTruthy()
    expect(screen.queryByText("Second install shot")).toBeTruthy()
  })

  it("renders the context card", () => {
    renderWithRelay()

    expect(screen.queryByTestId("ShowContextCard")).toBeTruthy()
  })

  it("renders artworks filter header", () => {
    renderWithRelay()

    expect(screen.queryByTestId("HeaderArtworksFilter")).toBeTruthy()
  })

  describe("search image button", () => {
    describe("with AREnableImageSearch feature flag disabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImageSearch: false })
      })

      it("should not be rendered", () => {
        renderWithRelay()

        expect(screen.queryByLabelText("Search by image")).toBeNull()
      })
    })

    describe("with AREnableImageSearch feature flag enabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImageSearch: true })
      })

      it("should not be rendered when show is NOT active", () => {
        renderWithRelay({
          Show: () => ({
            isActive: false,
            slug: "a-non-active-show",
            isReverseImageSearchEnabled: true,
          }),
        })

        expect(screen.queryByLabelText("Search by image")).toBeNull()
      })

      it("should not be rendered when show doesn't have any indexed artworks", () => {
        renderWithRelay({
          Show: () => ({
            isActive: true,
            slug: "an-active-show-without-indexed-artworks",
            isReverseImageSearchEnabled: false,
          }),
        })

        expect(screen.queryByLabelText("Search by image")).toBeNull()
      })

      it("should be rendered when show has indexed artworks, is active and feature flag is enabled", () => {
        renderWithRelay({
          Show: () => ({
            isActive: true,
            slug: "an-active-show-with-indexed-artworks",
            isReverseImageSearchEnabled: true,
          }),
        })

        expect(screen.queryByLabelText("Search by image")).toBeTruthy()
      })
    })
  })
})
