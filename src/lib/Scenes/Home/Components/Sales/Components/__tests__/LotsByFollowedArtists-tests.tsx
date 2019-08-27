import "react-native"

import React from "react"

import { getTestWrapper } from "lib/utils/getTestWrapper"
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
      query: {
        sale_artworks: {
          edges: [
            {
              node: {
                name: "TestName",
                sale: {
                  is_open: true,
                },
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
