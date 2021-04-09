import { MyProfileTestsQuery } from "__generated__/MyProfileTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import { extractText } from "lib/tests/extractText"
import { Platform } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyProfileContainer, MyProfileQueryRenderer } from "../MyProfile"

jest.mock("../LoggedInUserInfo")
jest.unmock("react-relay")

describe(MyProfileQueryRenderer, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyProfileTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyProfileTestsQuery {
          me {
            ...MyProfile_me
          }
        }
      `}
      render={({ props }) => {
        if (props?.me) {
          return <MyProfileContainer me={props.me} />
        }
      }}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("renders without throwing an error", () => {
    getWrapper()
  })

  it("renders MyCollections app if feature flag is on", () => {
    const tree = getWrapper({
      Me: () => ({
        labFeatures: ["My Collection"],
      }),
    })
    expect(extractText(tree.root)).toContain("My Collection")
  })

  it("doesn't render MyCollections app if feature flag is not on", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).not.toContain("My Collection")
  })

  it("renders push notifications on iOS", () => {
    Platform.OS = "ios"
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Push notifications")
  })

  it("doesn't render push notifications on Android", () => {
    Platform.OS = "android"
    const tree = getWrapper()
    expect(extractText(tree.root)).not.toContain("Push notifications")
  })
})
