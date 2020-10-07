import { MyCollectionArtworkListTestsQuery } from "__generated__/MyCollectionArtworkListTestsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { AppStore } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkListContainer } from "../MyCollectionArtworkList"
import { MyCollectionArtworkListItemFragmentContainer } from "../MyCollectionArtworkListItem"

jest.unmock("react-relay")

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

    expect(wrapper.root.findByType(FancyModalHeader)).toBeDefined()
    expect(wrapper.root.findByType(FlatList)).toBeDefined()
    expect(wrapper.root.findByType(MyCollectionArtworkListItemFragmentContainer)).toBeDefined()
  })

  it("calls proper actions on press", () => {
    const spy = jest.fn()
    const navSpy = jest.fn()
    AppStore.actions.myCollection.artwork.setMeGlobalId = spy as any
    AppStore.actions.myCollection.navigation.navigateToAddArtwork = navSpy as any
    const wrapper = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation))
    wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()
    expect(spy).toHaveBeenCalledWith("<Me-mock-id-1>")
    expect(navSpy).toHaveBeenCalled()
  })
})
