import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, RelayProp } from "react-relay"
import { FollowArtistButton, FollowArtistButtonFragmentContainer } from "../FollowArtistButton"

jest.unmock("react-relay")

describe("FollowArtistButton", () => {
  it("renders button text correctly", () => {
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

  describe("Following an artist", () => {
    const getWrapper = async ({ mockArtistData, mockFollowResults }) => {
      return await renderRelayTree({
        Component: (props: any) => (
          <Theme>
            <FollowArtistButtonFragmentContainer {...props} />
          </Theme>
        ),
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
      expect(followButton.text()).toMatchInlineSnapshot(`"Following"`)

      await followArtistButton
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      followArtistButton.update()

      const updatedFollowButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })

    it("correctly displays when the work is not followed, and allows following", async () => {
      const followResponse = { artist: { id: followArtistButtonArtist.id, is_followed: true } }

      const followArtistButton = await getWrapper({
        mockArtistData: followArtistButtonArtist,
        mockFollowResults: followResponse,
      })

      const followButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)

      await followArtistButton
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      followArtistButton.update()

      const updatedFollowButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Following"`)
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

      await followArtistButton
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      followArtistButton.update()

      const updatedFollowButton = followArtistButton.find(TouchableWithoutFeedback).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })
  })
})

const followArtistButtonArtist = {
  id: "12345",
  slug: "andy-warhol",
  internalID: "12345",
  gravityID: "andy-warhol",
  is_followed: false,
  " $refType": null,
  " $fragmentRefs": null,
}
