import { Sans, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import { graphql, RelayProp } from "react-relay"
import { FollowArtistButton, FollowArtistButtonFragmentContainer } from "../FollowArtistButton"

jest.unmock("react-relay")

describe("FollowArtistButton", () => {
  describe("with AR enabled", () => {
    it("renders buttons correctly", () => {
      const component = mount(
        <Theme>
          <FollowArtistButton relay={{ environment: {} } as RelayProp} artist={followArtistButtonArtist} />
        </Theme>
      )
      expect(component.find(TouchableWithoutFeedback).length).toEqual(1)

      expect(
        component
          .find(TouchableWithoutFeedback)
          .at(0)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"Follow"`)
    })
  })

  describe("Following an artist", () => {
    const getWrapper = async ({ mockArtistData, mockFollowResults }) => {
      return await renderRelayTree({
        Component: FollowArtistButtonFragmentContainer,
        query: graphql`
          query FollowArtistButtonTestsQuery {
            artist(id: "artistID") {
              ...FollowArtistButton_artist
            }
          }
        `,
        mockData: { artist: mockArtistData },
        mockMutationResults: { followArtist: mockFollowResults },
      })
    }

    it("correctly displays when the artist is already followed, and allows unfollowing", async () => {
      const followArtistButtonArtistFollowed = {
        ...followArtistButtonArtist,
        is_followed: true,
      }

      const unfollowResponse = {
        artist: {
          id: followArtistButtonArtist.id,
          is_followed: false,
        },
      }

      const followArtistButton = await getWrapper({
        mockArtistData: followArtistButtonArtistFollowed,
        mockFollowResults: unfollowResponse,
      })

      const followButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      console.log("FOLLOW BUTTON", followButton.text())
      expect(followButton.text()).toMatchInlineSnapshot(`"Following"`)
      // expect(followButton.props().color).toMatchInlineSnapshot(`"#6E1EFF"`)

      await followArtistButton
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      followArtistButton.update()

      const updatedFollowButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      console.log("FOLLOW BUTTONdsafsddsf", updatedFollowButton.text())
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
      // expect(updatedFollowButton.props().color).toMatchInlineSnapshot(`"#000"`)
    })

    it.only("correctly displays when the work is not saved, and allows saving", async () => {
      const followResponse = { artist: { id: followArtistButtonArtist.id, is_followed: true } }

      const followArtistButton = await getWrapper({
        mockArtistData: followArtistButtonArtist,
        mockFollowResults: followResponse,
      })

      const followButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)
      // expect(followButton.props().color).toMatchInlineSnapshot(`"#000"`)

      await followArtistButton
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      followArtistButton.update()

      const updatedFollowButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Followed"`)
      // expect(updatedFollowButton.props().color).toMatchInlineSnapshot(`"#6E1EFF"`)
    })

    // TODO Update once we can use relay's new facilities for testing
    xit("handles errors in saving gracefully", async () => {
      const followArtistButton = await renderRelayTree({
        Component: FollowArtistButtonFragmentContainer,
        query: graphql`
          query FollowArtistButtonTestsErrorQuery {
            artist(id: "artistID") {
              ...FollowArtistButton_artist
            }
          }
        `,
        mockData: { artist: followArtistButtonArtist },
        mockMutationResults: {
          FollowArtistButtonFragmentContainer: () => {
            return Promise.reject(new Error("failed to fetch"))
          },
        },
      })

      const followButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)
      expect(followButton.props().color).toMatchInlineSnapshot(`"#000"`)

      await followArtistButton
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      followArtistButton.update()

      const updatedFollowButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
      // expect(updatedFollowButton.props().color).toMatchInlineSnapshot(`"#000"`)
    })
  })
})

// const followArtistButtonArtist = {
//   id: "artwork12345",
//   internalID: "12345",
//   is_saved: false,
//   " $refType": null,
// }

const followArtistButtonArtist = {
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
