import { MyProfileSettingsTestsQuery } from "__generated__/MyProfileSettingsTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Platform } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyProfileSettingsContainer, MyProfileSettingsQueryRenderer } from "../MyProfileSettings"

jest.mock("../LoggedInUserInfo")
jest.unmock("react-relay")

describe(MyProfileSettingsQueryRenderer, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyProfileSettingsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyProfileSettingsTestsQuery {
          me {
            ...MyProfileSettings_me
          }
        }
      `}
      render={({ props }) => {
        if (props?.me) {
          return <MyProfileSettingsContainer me={props.me} />
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

  it("renders push notifications on iOS", () => {
    Platform.OS = "ios"
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Push Notifications")
  })

  it("renders push notifications on Android", () => {
    Platform.OS = "android"
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Push Notifications")
  })

  it("renders Saved Alerts only when the AREnableSavedSearchV2 flag is enable", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchV2: true })

    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Saved Alerts")
  })
})
