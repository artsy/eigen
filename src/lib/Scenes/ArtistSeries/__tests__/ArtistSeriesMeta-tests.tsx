import {
  ArtistSeriesMetaTestsQuery,
  ArtistSeriesMetaTestsQueryRawResponse,
} from "__generated__/ArtistSeriesMetaTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { ArtistSeriesMeta, ArtistSeriesMetaFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMeta"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { EntityHeader } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("Artist Series Meta", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesMetaTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesMetaTestsQuery @raw_response_type {
          artistSeries(id: "pumpkins") {
            ...ArtistSeriesMeta_artistSeries
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          return <ArtistSeriesMetaFragmentContainer artistSeries={props.artistSeries} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = () => {
    const tree = renderWithWrappers(<TestRenderer />)
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
    expect(wrapper.root.findAllByType(ArtistSeriesMeta)).toHaveLength(1)
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

const ArtistSeriesFixture: ArtistSeriesMetaTestsQueryRawResponse = {
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
