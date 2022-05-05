import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React from "react"
import { QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import {
  MyCollectionInsightsContainer,
  MyCollectionInsightsPlaceHolder,
} from "./MyCollectionInsights"

jest.unmock("react-relay")

describe("MyCollectionInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionInsightsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionInsightsQuery @raw_response_type {
          me {
            ...MyCollectionInsights_me
          }
        }
      `}
      variables={{}}
      render={renderWithPlaceholder({
        Container: MyCollectionInsightsContainer,
        renderPlaceholder: MyCollectionInsightsPlaceHolder,
      })}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("container renders without throwing an error", () => {
    renderWithWrappersTL(<TestRenderer />)
  })
})
