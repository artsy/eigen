import React from "react"
import "react-native"

import { renderWithLayout } from "lib/tests/renderWithLayout"

import { Conversations } from "../"

const devices = {
  "iPhone 4": { width: 320, height: 480 },
  "iPhone 5": { width: 320, height: 569 },
  "iPhone 6": { width: 375, height: 667 },
  "iPad in portrait mode": { width: 768, height: 1024 },
  "iPad in landscape mode": { width: 1024, height: 768 },
}

Object.keys(devices).forEach(device => {
  it(`looks correct for ${device} when the user has no conversations`, () => {
    const dimensions = devices[device]
    const tree = renderWithLayout(
      <Conversations
        relay={{ hasMore: jest.fn() } as any}
        me={
          {
            conversations: {
              pageInfo: {
                hasNextPage: false,
                endCursor: null,
              },
              edges: [],
            },
          } as any
        }
      />,
      dimensions
    )
    expect(tree).toMatchSnapshot()
  })
})
