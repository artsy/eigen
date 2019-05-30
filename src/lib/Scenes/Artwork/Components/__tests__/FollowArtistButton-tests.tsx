import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { FollowArtistButtonFragmentContainer as FollowArtistButton } from "../FollowArtistButton"

jest.unmock("react-relay")
const Artwork = createFragmentContainer(
  props => <FollowArtistButton artist={FollowArtistButtonArtist} />,
  graphql`
    fragment FollowArtistButton_artist on Artist {
      __id
      id
      _id
      is_followed
      counts {
        follows
      }
    }
  `
)
it("renders a Relay tree", done => {
  const wrapper = mount(
    <MockRelayRenderer
      Component={Artwork}
      query={graphql`
        query MockRelayRendererQuery {
          artist(id: "andy-warhol") {
            ...FollowArtistButton_artist
          }
        }
      `}
      mockResolvers={{
        Artist: () => ({
          __id: "12345",
          id: "andy-warhol",
          _id: "34567",
          is_followed: false,
          counts: {
            follows: 6,
          },
        }),
      }}
    />
  )
  setTimeout(() => {
    expect(wrapper.find(TouchableWithoutFeedback).text()).toEqual("Follow")
    // expect(wrapper.find("img").props().src).toEqual("http://test/image.jpg")
    done()
  }, 10)
})

// jest.unmock("react-relay")

// jest.mock("react-relay", () => ({
//   commitMutation: jest.fn(),
//   createFragmentContainer: component => component,
// }))

// const render = () =>
//   renderUntil(
// wrapper => {
//   return wrapper.text().includes("Follow")
// },
// <MockRelayRenderer
//   Component={({ artist }) => (
//     <Theme>
//       <FollowArtistButton artist={artist} />
//     </Theme>
//   )}
//   query={graphql`
//     query FollowArtistButtonTestsQuery {
//       artist(id: "andy-warhol") {
//         ...FollowArtistButton_artist
//       }
//     }
//   `}
//   mockData={{
//     data: FollowArtistButtonArtist,
//   }}
// />
//   wrapper => {
//     return wrapper.text().includes("Follow")
//   },
//   <MockRelayRenderer
//     Component={(props: any) => <FollowArtistButton artist={FollowArtistButtonArtist} {...props} />}
//     query={graphql`
//       query FollowArtistButtonTestsQuery {
//         artist(id: "andy-warhol") {
//           ...FollowArtistButton_artist
//         }
//       }
//     `}
//     mockResolvers={{
//       artist: () => FollowArtistButtonArtist,
//     }}
//   />
// )

// describe("FollowArtistButton", () => {
//   const getWrapper = artist => {
//     return mount(
//       <Theme>
//         <FollowArtistButton relay={{ environment: "" }} artist={artist} />
//       </Theme>
//     )
//   }

// window.location.assign = jest.fn()

// let testProps
// beforeEach(() => {
//   testProps = {
//     artist: {
//       id: "damon-zucconi",
//       __id: "1234",
//       is_followed: false,
//       counts: { follows: 99 },
//     },
//     onOpenAuthModal: jest.fn(),
//     tracking: { trackEvent: jest.fn() },
//   }
// })

//   describe("when a user is not following the artist", () => {
//     it("renders the button text correctly", () => {
//       // const component = mount(
//       //   <Theme>
//       //     <FollowArtistButton artist={FollowArtistButtonArtist} />
//       //   </Theme>
//       // )
//       const component = getWrapper(FollowArtistButtonArtist)
//       // const component = await render()
//       const button = component.find(TouchableWithoutFeedback).at(0)
//       expect(button.text()).toContain("Follow")
//     })

//     it.only("updates the button text when the follow button is clicked", () => {
//       // const component = mount(
//       //   <Theme>
//       //     <FollowArtistButton artist={FollowArtistButtonArtist} />
//       //   </Theme>
//       // )
//       // const component = await render()
//       const component = getWrapper(FollowArtistButtonArtist)
//       const button = component.find(TouchableWithoutFeedback).at(0)
//       button.props().onPress()
//       expect(button.text()).toContain("Following")
//     })
//   })

//   describe("when a user is following the artist", () => {
//     it("renders the button text correctly", () => {
//       // const component = mount(
//       //   <Theme>
//       //     <FollowArtistButton artist={FollowArtistButtonArtist} />
//       //   </Theme>
//       // )
//       // const component = await render()
//       const button = component.find(TouchableWithoutFeedback).at(0)
//       expect(button.text()).toContain("Following")
//     })

//     it("updates the button text when the follow button is clicked", () => {
//       // const component = mount(
//       //   <Theme>
//       //     <FollowArtistButton artist={FollowArtistButtonArtist} />
//       //   </Theme>
//       // )
//       // const component = await render()
//       const button = component.find(TouchableWithoutFeedback).at(0)
//       button.props().onPress()
//       expect(button.text()).toContain("Follow")
//     })
//   })
// })

const FollowArtistButtonArtist = {
  __id: "12345",
  id: "andy-warhol",
  _id: "34567",
  is_followed: false,
  counts: {
    follows: 6,
  },
  " $refType": null,
  " $fragmentRefs": null,
}
