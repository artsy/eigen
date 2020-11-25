import "react-native"

import React from "react"

import { getTestWrapper } from "lib/utils/getTestWrapper"
import { LotsByFollowedArtists } from "../LotsByFollowedArtists"

describe("LotsByFollowedArtists", () => {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  let props

  beforeEach(() => {
    props = {
      title: "Test Lots",
      relay: {
        hasMore: jest.fn(),
        loadMore: jest.fn(),
        isLoading: jest.fn(),
      },
      me: {
        lotsByFollowedArtistsConnection: {
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const { text } = getTestWrapper(<LotsByFollowedArtists {...props} />)
    expect(text).toContain("Test Lots")
  })
})
