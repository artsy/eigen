import { EntityHeader, Theme } from "@artsy/palette"
import { ArtistSeriesTestsQuery, ArtistSeriesTestsQueryRawResponse } from "__generated__/ArtistSeriesTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistSeries, ArtistSeriesFragmentContainer } from "../ArtistSeries"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("Artist Series Rail", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesTestsQuery @raw_response_type {
          artistSeries(id: "pumpkins") {
            ...ArtistSeries_artistSeries
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          return (
            <Theme>
              <ArtistSeriesFragmentContainer artistSeries={props.artistSeries} />
            </Theme>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...ArtistSeriesFixture,
        },
      })
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ArtistSeries)).toHaveLength(1)
  })

  it("renders the Artist Series title", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findByProps({ "data-test-id": "title" }).props.children).toBe("These are the Pumpkins")
  })

  it("renders the Artist Series description", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findByProps({ "data-test-id": "description" }).props.content).toBe(
      "A deliciously artistic variety of painted pumpkins."
    )
  })

  it("renders an entity header component with artist's meta data", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(EntityHeader)).toHaveLength(1)
    expect(wrapper.root.findAllByType(EntityHeader)[0].props.name).toBe("Yayoi Kusama")
  })

  it("navigates user to artist page when entity header artist tapped ", () => {
    const wrapper = getWrapper().root.findByType(TouchableOpacity)
    wrapper.props.onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/artist/yayoi-kusama")
  })
})

const ArtistSeriesFixture: ArtistSeriesTestsQueryRawResponse = {
  artistSeries: {
    title: "These are the Pumpkins",
    description: "A deliciously artistic variety of painted pumpkins.",
    artists: [
      {
        id: "an-id",
        internalID: "123456ASCFG",
        name: "Yayoi Kusama",
        slug: "yayoi-kusama",
        isFollowed: true,
        image: {
          url: "https://www.images.net/pumpkins",
        },
      },
    ],
  },
}
