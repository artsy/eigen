import { ShowContextCardTestsQuery } from "__generated__/ShowContextCardTestsQuery.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  ShowContextCard,
  ShowContextCardFragmentContainer,
} from "app/Scenes/Show/Components/ShowContextCard"
import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { TouchableOpacity } from "react-native"
import FastImage from "@d11/react-native-fast-image"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

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
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ShowContextCard)).toHaveLength(1)
  })

  describe("when the show is a fair booth", () => {
    it("renders contextual info about the fair", () => {
      const wrapper = getWrapper({
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

      const text = extractText(wrapper.root)
      expect(text).toMatch("Part of IFPDA Print Fair 2020")
      expect(text).toMatch("Jan 1 - Jan 31")

      const mainImageURL = wrapper.root.findByProps({ testID: "main-image" }).props.src
      const iconImageURL = wrapper.root.findByProps({ testID: "icon-image" }).props.src

      expect(iconImageURL).toBe("http://test.artsy.net/fair-logo.jpg")
      expect(mainImageURL).toBe("http://test.artsy.net/fair-main.jpg")
    })

    it("navigates to the fair", () => {
      const wrapper = getWrapper({
        Show: () => ({
          isFairBooth: true,
          fair: {
            slug: "ifpda-2020",
          },
        }),
      })

      const title = wrapper.root.findByType(SectionTitle)
      title.props.onPress()
      expect(navigate).toHaveBeenCalledWith("fair/ifpda-2020")
    })

    it("tracks taps", () => {
      const wrapper = getWrapper({
        Show: () => ({
          isFairBooth: true,
          internalID: "example-show-id",
          slug: "example-show-slug",
        }),
        Fair: () => ({
          internalID: "example-fair-id",
          slug: "example-fair-slug",
        }),
      })

      act(() => {
        wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
      })

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
      const wrapper = getWrapper({
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

      const text = extractText(wrapper.root)
      expect(text).toMatch("Presented by Pace Prints")
      expect(text).toMatch("New York, London")

      const renderedImages = wrapper.root
        .findAllByType(FastImage)
        .map((img) => img.props.source.uri)
      expect(renderedImages).toContain("http://test.artsy.net/artwork-1.jpg")
      expect(renderedImages).toContain("http://test.artsy.net/artwork-2.jpg")
      expect(renderedImages).toContain("http://test.artsy.net/artwork-3.jpg")
    })

    it("navigates to the partner profile", () => {
      const wrapper = getWrapper({
        Show: () => ({
          isFairBooth: false,
          partner: {
            profile: {
              slug: "pace-prints",
            },
          },
        }),
      })

      const title = wrapper.root.findByType(SectionTitle)
      title.props.onPress()
      expect(navigate).toHaveBeenCalledWith("pace-prints")
    })

    it("tracks taps", () => {
      const wrapper = getWrapper({
        Show: () => ({
          isFairBooth: false,
          internalID: "example-show-id",
          slug: "example-show-slug",
        }),
        Partner: () => ({
          internalID: "example-partner-id",
          slug: "example-partner-slug",
        }),
      })

      act(() => {
        wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
      })

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
