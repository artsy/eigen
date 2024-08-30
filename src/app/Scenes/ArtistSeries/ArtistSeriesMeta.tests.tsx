import { EntityHeader } from "@artsy/palette-mobile"
import { ArtistSeriesMetaTestsQuery } from "__generated__/ArtistSeriesMetaTestsQuery.graphql"
import {
  ArtistSeriesMeta,
  ArtistSeriesMetaFragmentContainer,
} from "app/Scenes/ArtistSeries/ArtistSeriesMeta"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

describe("Artist Series Meta", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
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
      variables={{}}
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
    const { root } = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...ArtistSeriesFixture,
        },
      })
    })
    return root
  }

  it("renders without throwing an error", async () => {
    const root = getWrapper()
    expect(await root.findAllByType(ArtistSeriesMeta)).toHaveLength(1)
  })

  it("renders the Artist Series title", async () => {
    const root = getWrapper()
    const title = await root.findByProps({ testID: "title" })
    expect(title.props.children).toBe("These are the Pumpkins")
  })

  it("renders the Artist Series description", async () => {
    const root = getWrapper()
    const description = await root.findByProps({ testID: "description" })
    expect(description.props.content).toBe("A deliciously artistic variety of painted pumpkins.")
  })

  it("renders an entity header component with artist's meta data", async () => {
    const root = getWrapper()
    const entityHeaders = await root.findAllByType(EntityHeader)
    expect(entityHeaders).toHaveLength(1)
    expect(entityHeaders[0].props.name).toBe("Yayoi Kusama")
  })

  it("navigates user to artist page when entity header artist tapped ", async () => {
    const button = await getWrapper().findByType(TouchableOpacity)
    button.props.onPress()
    expect(navigate).toHaveBeenCalledWith("/artist/yayoi-kusama")
  })

  it("tracks unfollows", async () => {
    const root = getWrapper()
    const entityHeaders = await root.findAllByType(EntityHeader)
    const followButtons = await entityHeaders[0].findAllByType(TouchableWithoutFeedback)

    followButtons[0].props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "unfollowedArtist",
      context_module: "featuredArtists",
      context_owner_id: "as1234",
      context_owner_slug: "cool-artist-series",
      context_owner_type: "artistSeries",
      owner_id: "123456ASCFG",
      owner_slug: "yayoi-kusama",
      owner_type: "artist",
    })
  })
})

const ArtistSeriesFixture: ArtistSeriesMetaTestsQuery["rawResponse"] = {
  artistSeries: {
    id: "bs5678",
    internalID: "as1234",
    slug: "cool-artist-series",
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
