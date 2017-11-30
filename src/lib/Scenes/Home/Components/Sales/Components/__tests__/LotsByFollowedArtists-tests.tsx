import "react-native"
import React from "react"
import renderer from "react-test-renderer"
import { test } from "../LotsByFollowedArtists"
import { getTestWrapper } from "lib/utils/getTestWrapper"

describe("LotsByFollowedArtists", () => {
  let props

  beforeEach(() => {
    props = {
      title: "Test Lots",
      relay: {
        hasMore: jest.fn(),
        loadMore: jest.fn(),
      },
      viewer: {
        sale_artworks: {
          edges: [
            {
              node: {
                name: "TestName",
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
    const { text } = getTestWrapper(<test.GridContainer {...props} />)
    expect(text).toContain("Test Lots")
  })
})
