// TODO: fix me bitte

// import { EntityHeader } from "@artsy/palette-mobile"
// import { ArtistSeriesMetaTestsQuery } from "__generated__/ArtistSeriesMetaTestsQuery.graphql"
// import {
//   ArtistSeriesMeta,
//   ArtistSeriesMetaFragmentContainer,
// } from "app/Scenes/ArtistSeries/ArtistSeriesMeta"
// import { navigate } from "app/system/navigation/navigate"
// import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
// import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
// import { TouchableOpacity, TouchableWithoutFeedback } from "react-native"
// import { graphql, QueryRenderer } from "react-relay"
// import { act } from "react-test-renderer"
// import { createMockEnvironment } from "relay-test-utils"

// describe("Artist Series Meta", () => {
//   let env: ReturnType<typeof createMockEnvironment>

//   beforeEach(() => {
//     env = createMockEnvironment()
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   const TestRenderer = () => (
//     <QueryRenderer<ArtistSeriesMetaTestsQuery>
//       environment={env}
//       query={graphql`
//         query ArtistSeriesMetaTestsQuery @raw_response_type {
//           artistSeries(id: "pumpkins") {
//             ...ArtistSeriesMeta_artistSeries
//           }
//         }
//       `}
//       variables={{}}
//       render={({ props, error }) => {
//         if (props?.artistSeries) {
//           return <ArtistSeriesMetaFragmentContainer artistSeries={props.artistSeries} />
//         } else if (error) {
//           console.log(error)
//         }
//       }}
//     />
//   )

//   const getWrapper = () => {
//     const tree = renderWithWrappersLEGACY(<TestRenderer />)
//     act(() => {
//       env.mock.resolveMostRecentOperation({
//         errors: [],
//         data: {
//           ...ArtistSeriesFixture,
//         },
//       })
//     })
//     return tree
//   }

//   it("renders without throwing an error", () => {
//     const wrapper = getWrapper()
//     expect(wrapper.root.findAllByType(ArtistSeriesMeta)).toHaveLength(1)
//   })

//   it("renders the Artist Series title", () => {
//     const wrapper = getWrapper()
//     expect(wrapper.root.findByProps({ testID: "title" }).props.children).toBe(
//       "These are the Pumpkins"
//     )
//   })

//   it("renders the Artist Series description", () => {
//     const wrapper = getWrapper()
//     expect(wrapper.root.findByProps({ testID: "description" }).props.content).toBe(
//       "A deliciously artistic variety of painted pumpkins."
//     )
//   })

//   it("renders an entity header component with artist's meta data", () => {
//     const wrapper = getWrapper()
//     expect(wrapper.root.findAllByType(EntityHeader)).toHaveLength(1)
//     expect(wrapper.root.findAllByType(EntityHeader)[0].props.name).toBe("Yayoi Kusama")
//   })

//   it("navigates user to artist page when entity header artist tapped ", () => {
//     const wrapper = getWrapper().root.findByType(TouchableOpacity)
//     wrapper.props.onPress()
//     expect(navigate).toHaveBeenCalledWith("/artist/yayoi-kusama")
//   })

//   it("tracks unfollows", () => {
//     const wrapper = getWrapper()
//     const followButton = wrapper.root
//       .findAllByType(EntityHeader)[0]
//       .findAllByType(TouchableWithoutFeedback)[0]
//     followButton.props.onPress()
//     expect(mockTrackEvent).toHaveBeenCalledWith({
//       action: "unfollowedArtist",
//       context_module: "featuredArtists",
//       context_owner_id: "as1234",
//       context_owner_slug: "cool-artist-series",
//       context_owner_type: "artistSeries",
//       owner_id: "123456ASCFG",
//       owner_slug: "yayoi-kusama",
//       owner_type: "artist",
//     })
//   })
// })

// const ArtistSeriesFixture: ArtistSeriesMetaTestsQuery["rawResponse"] = {
//   artistSeries: {
//     internalID: "as1234",
//     slug: "cool-artist-series",
//     title: "These are the Pumpkins",
//     description: "A deliciously artistic variety of painted pumpkins.",
//     artists: [
//       {
//         id: "an-id",
//         internalID: "123456ASCFG",
//         name: "Yayoi Kusama",
//         slug: "yayoi-kusama",
//         isFollowed: true,
//         image: {
//           url: "https://www.images.net/pumpkins",
//         },
//       },
//     ],
//   },
// }
