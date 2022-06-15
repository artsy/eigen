import { FollowArtistLinkTestsQuery$data } from "__generated__/FollowArtistLinkTestsQuery.graphql"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderRelayTree } from "app/tests/renderRelayTree"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, RelayProp } from "react-relay"
import { FollowArtistLink, FollowArtistLinkFragmentContainer } from "./FollowArtistLink"

jest.unmock("react-relay")

describe("FollowArtistLink", () => {
  it("renders button text correctly", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <FollowArtistLink
            relay={{ environment: {} } as RelayProp}
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            artist={followArtistLinkArtist}
          />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(TouchableWithoutFeedback).length).toEqual(1)

    expect(component.find(TouchableWithoutFeedback).at(0).render().text()).toMatchInlineSnapshot(
      `"Follow"`
    )
  })

  describe("Following an artist", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const getWrapper = async ({ mockArtistData, mockFollowResults }) => {
      return await renderRelayTree({
        Component: (props: any) => (
          <GlobalStoreProvider>
            <Theme>
              <FollowArtistLinkFragmentContainer {...props} />
            </Theme>
          </GlobalStoreProvider>
        ),
        query: graphql`
          query FollowArtistLinkTestsQuery @raw_response_type {
            artist(id: "artistID") {
              ...FollowArtistLink_artist
            }
          }
        `,
        mockData: { artist: mockArtistData } as FollowArtistLinkTestsQuery$data,
        mockMutationResults: { followArtist: mockFollowResults },
      })
    }

    it("correctly displays when the artist is already followed, and allows unfollowing", async () => {
      const followArtistLinkArtistFollowed = {
        ...followArtistLinkArtist,
        is_followed: true,
      }

      const unfollowResponse = {
        artist: {
          id: followArtistLinkArtist.id,
          is_followed: false,
        },
      }

      const followArtistLink = await getWrapper({
        mockArtistData: followArtistLinkArtistFollowed,
        mockFollowResults: unfollowResponse,
      })

      const followButton = followArtistLink.find(TouchableWithoutFeedback).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Following"`)

      await followArtistLink.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      followArtistLink.update()

      const updatedFollowButton = followArtistLink.find(TouchableWithoutFeedback).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })

    it("correctly displays when the work is not followed, and allows following", async () => {
      const followResponse = { artist: { id: followArtistLinkArtist.id, is_followed: true } }

      const followArtistLink = await getWrapper({
        mockArtistData: followArtistLinkArtist,
        mockFollowResults: followResponse,
      })

      const followButton = followArtistLink.find(TouchableWithoutFeedback).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)

      await followArtistLink.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      followArtistLink.update()

      const updatedFollowButton = followArtistLink.find(TouchableWithoutFeedback).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Following"`)
    })

    // TODO Update once we can use relay's new facilities for testing
    xit("handles errors in saving gracefully", async () => {
      const followArtistLink = await renderRelayTree({
        Component: FollowArtistLinkFragmentContainer,
        query: graphql`
          query FollowArtistLinkTestsErrorQuery @raw_response_type {
            artist(id: "artistID") {
              ...FollowArtistLink_artist
            }
          }
        `,
        mockData: {
          artist: followArtistLinkArtist,
        } as any,
        mockMutationResults: {
          FollowArtistLinkFragmentContainer: () => {
            return Promise.reject(new Error("failed to fetch"))
          },
        },
      })

      const followButton = followArtistLink.find(TouchableWithoutFeedback).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)

      await followArtistLink.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      followArtistLink.update()

      const updatedFollowButton = followArtistLink.find(TouchableWithoutFeedback).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })
  })
})

const followArtistLinkArtist = {
  id: "12345",
  slug: "andy-warhol",
  internalID: "12345",
  gravityID: "andy-warhol",
  is_followed: false,
  " $refType": null,
  " $fragmentRefs": null,
}
