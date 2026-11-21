import { act, fireEvent, screen, within } from "@testing-library/react-native"
import { ShowContextCardTestsQuery } from "__generated__/ShowContextCardTestsQuery.graphql"
import { ShowContextCardFragmentContainer } from "app/Scenes/Show/Components/ShowContextCard"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

// Render FastImage as a host view so its `source` can be asserted on
jest.mock("@d11/react-native-fast-image", () => {
  const React = jest.requireActual("react")
  const { View } = jest.requireActual("react-native")
  const FastImage = (props: any) => React.createElement(View, { testID: "fast-image", ...props })
  FastImage.priority = { low: "low", normal: "normal", high: "high" }
  FastImage.resizeMode = {
    contain: "contain",
    cover: "cover",
    stretch: "stretch",
    center: "center",
  }
  FastImage.preload = jest.fn()
  return { __esModule: true, default: FastImage }
})

describe("ShowContextCard", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ShowContextCardTestsQuery>
      environment={env}
      query={graphql`
        query ShowContextCardTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...ShowContextCard_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowContextCardFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
  }

  it("renders without throwing an error", () => {
    getWrapper()
    expect(screen.getByTestId("ShowContextCard")).toBeOnTheScreen()
  })

  describe("when the show is a fair booth", () => {
    it("renders contextual info about the fair", () => {
      getWrapper({
        Show: () => ({
          isFairBooth: true,
          fair: {
            name: "IFPDA Print Fair 2020",
            exhibitionPeriod: "Jan 1 - Jan 31",
            profile: {
              icon: { imageUrl: "http://test.artsy.net/fair-logo.jpg" },
            },
            image: {
              imageUrl: "http://test.artsy.net/fair-main.jpg",
            },
          },
        }),
      })

      expect(screen.getByText(/Part of IFPDA Print Fair 2020/)).toBeOnTheScreen()
      expect(screen.getByText(/Jan 1 - Jan 31/)).toBeOnTheScreen()

      const mainImage = within(screen.getByTestId("main-image")).getByTestId("fast-image")
      const iconImage = within(screen.getByTestId("icon-image")).getByTestId("fast-image")

      expect(iconImage).toHaveProp(
        "source",
        expect.objectContaining({
          uri: expect.stringContaining(
            `src=${encodeURIComponent("http://test.artsy.net/fair-logo.jpg")}&`
          ),
        })
      )
      expect(mainImage).toHaveProp(
        "source",
        expect.objectContaining({
          uri: expect.stringContaining(
            `src=${encodeURIComponent("http://test.artsy.net/fair-main.jpg")}&`
          ),
        })
      )
    })

    it("navigates to the fair", () => {
      getWrapper({
        Show: () => ({
          isFairBooth: true,
          fair: {
            slug: "ifpda-2020",
          },
        }),
      })

      fireEvent.press(screen.getByTestId("touchable-wrapper"))
      expect(navigate).toHaveBeenCalledWith("fair/ifpda-2020")
    })

    it("tracks taps", () => {
      getWrapper({
        Show: () => ({
          isFairBooth: true,
          internalID: "example-show-id",
          slug: "example-show-slug",
        }),
        Fair: () => ({
          internalID: "example-fair-id",
          slug: "example-fair-slug",
          name: "Example Fair",
        }),
      })

      // the card itself (not the section title)
      fireEvent.press(screen.getByText("Example Fair"))

      expect(mockTrackEvent).toBeCalledWith({
        action: "tappedFairCard",
        context_module: "presentingFair",
        context_screen_owner_id: "example-show-id",
        context_screen_owner_slug: "example-show-slug",
        context_screen_owner_type: "show",
        destination_screen_owner_id: "example-fair-id",
        destination_screen_owner_slug: "example-fair-slug",
        destination_screen_owner_type: "fair",
        type: "thumbnail",
      })
    })
  })

  describe("when show is not a fair booth", () => {
    it("renders contextual info about the partner", () => {
      getWrapper({
        Show: () => ({
          isFairBooth: false,
          partner: {
            name: "Pace Prints",
            cities: ["New York", "London"],
            artworksConnection: {
              edges: [
                { node: { image: { url: "http://test.artsy.net/artwork-1.jpg" } } },
                { node: { image: { url: "http://test.artsy.net/artwork-2.jpg" } } },
                { node: { image: { url: "http://test.artsy.net/artwork-3.jpg" } } },
              ],
            },
          },
        }),
      })

      expect(screen.getByText(/Presented by Pace Prints/)).toBeOnTheScreen()
      expect(screen.getByText(/New York, London/)).toBeOnTheScreen()

      const renderedImages = screen.getAllByTestId("fast-image").map((img) => img.props.source.uri)
      expect(renderedImages).toContain("http://test.artsy.net/artwork-1.jpg")
      expect(renderedImages).toContain("http://test.artsy.net/artwork-2.jpg")
      expect(renderedImages).toContain("http://test.artsy.net/artwork-3.jpg")
    })

    it("navigates to the partner profile", () => {
      getWrapper({
        Show: () => ({
          isFairBooth: false,
          partner: {
            profile: {
              slug: "pace-prints",
            },
          },
        }),
      })

      fireEvent.press(screen.getByTestId("touchable-wrapper"))
      expect(navigate).toHaveBeenCalledWith("pace-prints")
    })

    it("tracks taps", () => {
      getWrapper({
        Show: () => ({
          isFairBooth: false,
          internalID: "example-show-id",
          slug: "example-show-slug",
        }),
        Partner: () => ({
          internalID: "example-partner-id",
          slug: "example-partner-slug",
          name: "Example Partner",
        }),
      })

      // the card itself (not the section title)
      fireEvent.press(screen.getByText("Example Partner"))

      expect(mockTrackEvent).toBeCalledWith({
        action: "tappedPartnerCard",
        context_module: "presentingPartner",
        context_screen_owner_id: "example-show-id",
        context_screen_owner_slug: "example-show-slug",
        context_screen_owner_type: "show",
        destination_screen_owner_id: "example-partner-id",
        destination_screen_owner_slug: "example-partner-slug",
        destination_screen_owner_type: "partner",
        type: "thumbnail",
      })
    })
  })
})
