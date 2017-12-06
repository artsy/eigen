import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Conversations } from "../"

it("looks correct when the user has no conversations", () => {
  const tree = renderer
    .create(
      <Conversations
        relay={{ hasMore: jest.fn() }}
        me={{
          conversations: {
            pageInfo: {
              hasNextPage: false,
            },
            edges: [],
          },
        }}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
