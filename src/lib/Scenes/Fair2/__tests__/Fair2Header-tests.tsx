import { Fair2HeaderTestsQuery } from "__generated__/Fair2HeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Fair2Header, Fair2HeaderFragmentContainer } from "lib/Scenes/Fair2/Components/Fair2Header"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Fair2TimingFragmentContainer } from "../Components/Fair2Timing"

jest.unmock("react-relay")

describe("Fair2Header", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Fair2HeaderTestsQuery>
      environment={env}
      query={graphql`
        query Fair2HeaderTestsQuery($fairID: String!) @relay_test_operation {
          fair(id: $fairID) {
            ...Fair2Header_fair
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2020" }}
      render={({ props, error }) => {
        if (props?.fair) {
          return <Fair2HeaderFragmentContainer fair={props.fair} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(Fair2Header)).toHaveLength(1)
  })

  it("renders the fair title", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        name: "Art Basel Hong Kong 2020",
      }),
    })
    expect(wrapper.root.findByProps({ variant: "largeTitle" }).props.children).toBe("Art Basel Hong Kong 2020")
  })

  it("renders the fair main image", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        image: {
          imageUrl: "https://testing.artsy.net/art-basel-hong-kong-image",
        },
      }),
    })
    expect(wrapper.root.findAllByType(OpaqueImageView)[0].props.imageURL).toBe(
      "https://testing.artsy.net/art-basel-hong-kong-image"
    )
  })

  it("renders the fair icon", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        profile: {
          icon: {
            imageUrl: "https://testing.artsy.net/art-basel-hong-kong-icon",
          },
        },
      }),
    })
    expect(wrapper.root.findAllByType(OpaqueImageView)[1].props.imageURL).toBe(
      "https://testing.artsy.net/art-basel-hong-kong-icon"
    )
  })

  it("renders the fair description", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        summary: "The biggest art fair in Hong Kong",
      }),
    })
    expect(extractText(wrapper.root)).toMatch("The biggest art fair in Hong Kong")
  })

  it("falls back to About when Summary isn't available", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        about: "A great place to buy art",
        summary: "",
      }),
    })
    expect(extractText(wrapper.root)).toMatch("A great place to buy art")
  })

  it("navigates to the fair info page on press of More Info", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        slug: "art-basel-hong-kong-2020",
      }),
    }).root.findByType(TouchableOpacity)
    wrapper.props.onPress()
    expect(navigate).toHaveBeenCalledWith("/fair/art-basel-hong-kong-2020/info")
  })

  it("does not show the More Info link if there is no info to show", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        about: "",
        fairContact: "",
        fairHours: "",
        fairLinks: "",
        fairTickets: "",
        location: {
          summary: "",
          coordinates: null,
        },
        summary: "",
        tagline: "",
        ticketsLink: "",
        sponsoredContent: null,
      }),
    })
    expect(wrapper.root.findAllByType(TouchableOpacity).length).toBe(0)
  })

  it("displays the timing info", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        endAt: "2020-09-19T08:00:00+00:00",
      }),
    })
    expect(wrapper.root.findAllByType(Fair2TimingFragmentContainer).length).toBe(1)
    expect(extractText(wrapper.root)).toMatch("Closed")
  })
})
