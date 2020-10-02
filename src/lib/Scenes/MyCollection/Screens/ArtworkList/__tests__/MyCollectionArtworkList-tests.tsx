import { MyCollectionArtworkListTestsQuery } from "__generated__/MyCollectionArtworkListTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkListContainer } from "../MyCollectionArtworkList"
import { MyCollectionArtworkListHeader } from "../MyCollectionArtworkListHeader"
import { MyCollectionArtworkListItemFragmentContainer } from "../MyCollectionArtworkListItem"

jest.unmock("react-relay")

jest.mock("../MyCollectionArtworkListHeader", () => ({
  MyCollectionArtworkListHeader: () => null,
}))

describe("MyCollectionArtworkList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkListTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkListTestsQuery @relay_test_operation {
          me {
            ...MyCollectionArtworkList_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return <MyCollectionArtworkListContainer me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders without throwing an error", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation))

    expect(wrapper.root.findByType(MyCollectionArtworkListHeader)).toBeDefined()
    expect(wrapper.root.findByType(FlatList)).toBeDefined()
    expect(wrapper.root.findByType(MyCollectionArtworkListItemFragmentContainer)).toBeDefined()
  })
})
