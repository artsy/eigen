import { Theme } from "@artsy/palette"
import { ViewingRoomHeaderTestsQuery } from "__generated__/ViewingRoomHeaderTestsQuery.graphql"
import { CountdownTimer } from "lib/Scenes/Fair/Components/FairHeader/CountdownTimer"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomHeaderContainer } from "../ViewingRoomHeader"

jest.unmock("react-relay")

describe("ViewingRoomHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
      <QueryRenderer<ViewingRoomHeaderTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query ViewingRoomHeaderTestsQuery {
            viewingRoom(id: "unused") {
              ...ViewingRoomHeader_viewingRoom
            }
          }
        `}
        render={renderWithLoadProgress(ViewingRoomHeaderContainer)}
        variables={{}}
      />
    </Theme>
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it("renders a background image", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ heroImageURL: "Foo" }),
      })
      return result
    })
    expect(tree.root.findByProps({ "data-test-id": "background-image" }).props.imageURL).toBe("Foo")
  })
  it("renders a title", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ title: "Foo" }),
      })
      return result
    })
    expect(extractText(tree.root.findByProps({ "data-test-id": "title" }))).toBe("Foo")
  })
  it("renders a countdown timer", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation)
      return result
    })
    expect(tree.root.findAllByType(CountdownTimer)).toHaveLength(1)
  })
})
