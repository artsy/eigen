import { FairHeaderTestsQuery } from "__generated__/FairHeaderTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { FairHeader, FairHeaderFragmentContainer } from "app/Scenes/Fair/Components/FairHeader"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Spacer } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { FairTimingFragmentContainer } from "./Components/FairTiming"

jest.unmock("react-relay")

describe("FairHeader", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<FairHeaderTestsQuery>
      environment={env}
      query={graphql`
        query FairHeaderTestsQuery($fairID: String!) @relay_test_operation {
          fair(id: $fairID) {
            ...FairHeader_fair
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2020" }}
      render={({ props, error }) => {
        if (props?.fair) {
          return <FairHeaderFragmentContainer fair={props.fair} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(FairHeader)).toHaveLength(1)
  })

  it("renders the fair title", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        name: "Art Basel Hong Kong 2020",
      }),
    })
    expect(wrapper.root.findByProps({ variant: "lg" }).props.children).toBe(
      "Art Basel Hong Kong 2020"
    )
  })

  it("renders the fair main image when present", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        image: {
          imageUrl: "https://testing.artsy.net/art-basel-hong-kong-image",
        },
      }),
    })
    const mainImage = wrapper.root.findAllByType(OpaqueImageView)[0]
    expect(mainImage.props).toMatchObject({
      imageURL: "https://testing.artsy.net/art-basel-hong-kong-image",
    })
  })

  it("renders a spacer instead when the fair main image is absent", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        image: null,
      }),
    })
    expect(wrapper.root.findAllByType(OpaqueImageView)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Spacer)).not.toHaveLength(0)
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
    expect(wrapper.root.findAllByType(FairTimingFragmentContainer).length).toBe(1)
    expect(extractText(wrapper.root)).toMatch("Closed")
  })
})
