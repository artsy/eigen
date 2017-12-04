import { getTestWrapper } from "lib/utils/getTestWrapper"
import React from "react"
import "react-native"
import renderer from "react-test-renderer"
import { LotsByFollowedArtists } from "../LotsByFollowedArtists"

describe("LotsByFollowedArtists", () => {
  let props

  beforeEach(() => {
    props = {
      title: "Test Lots",
      relay: {
        hasMore: jest.fn(),
        loadMore: jest.fn(),
        isLoading: jest.fn(),
      },
      viewer: {
        sale_artworks: {
          edges: [
            {
              node: {
                name: "TestName",
                is_biddable: true,
                artwork: {
                  id: "foo",
                },
              },
            },
          ],
        },
      },
    }
  })

  it("looks correct when rendered", () => {
    const { text } = getTestWrapper(<LotsByFollowedArtists {...props} />)
    expect(text).toContain("Test Lots")
  })
})
