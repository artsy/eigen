import "react-native"

import React from "react"

import { getTestWrapper } from "lib/utils/getTestWrapper"
import { LotsByFollowedArtists } from "../LotsByFollowedArtists"

describe("LotsByFollowedArtists", () => {
  it("looks correct when rendered", () => {
    const props: any = getProps()
    const { text } = getTestWrapper(<LotsByFollowedArtists {...props} />)
    expect(text).toContain("Test Lots")
  })

  it("should not show when there's no data", () => {
    const props: any = getProps(false)
    const { json } = getTestWrapper(<LotsByFollowedArtists {...props} />)
    expect(json.rendered).toEqual(null)
  })
})

const getProps = (withEdges = true) => ({
  title: "Test Lots",
  relay: {
    hasMore: () => false,
    loadMore: () => true,
    isLoading: () => false,
  },
  viewer: {
    sale_artworks: {
      edges: withEdges
        ? [
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
          ]
        : [],
    },
  },
})
