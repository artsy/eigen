import { SearchCriteriaAttributes } from "__generated__/SavedSearchBannerQuery.graphql"
import { SavedSearchBannerTestsQuery } from "__generated__/SavedSearchBannerTestsQuery.graphql"
import { PopoverMessage } from 'lib/Components/PopoverMessage/PopoverMessage'
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button, Text } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SavedSearchBannerRefetchContainer } from "../SavedSearchBanner"

jest.unmock("react-relay")

const mockFetchNotificationPermissions = LegacyNativeModules.ARTemporaryAPIModule
  .fetchNotificationPermissions as jest.Mock<any>

describe("SavedSearchBanner", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const attributes: SearchCriteriaAttributes = {
    priceMin: 300,
    priceMax: 500,
  }

  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => {
    return (
      <QueryRenderer<SavedSearchBannerTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query SavedSearchBannerTestsQuery($criteria: SearchCriteriaAttributes!) @relay_test_operation {
            me {
              ...SavedSearchBanner_me @arguments(criteria: $criteria)
            }
          }
        `}
        render={({ props }) => (
          <SavedSearchBannerRefetchContainer
            {...props}
            loading={props === null}
            attributes={attributes}
            artistId="banksy"
          />
        )}
        variables={{
          criteria: attributes,
        }}
      />
    )
  }

  it("renders correctly disabled state", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.children).toEqual("Enable")
    expect(buttonComponent.props.variant).toBe("primaryBlack")
    expect(buttonComponent.props.loading).toBe(false)
  })

  it("renders correctly enabled state", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment)

    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.children).toEqual("Disable")
    expect(buttonComponent.props.variant).toBe("secondaryOutline")
    expect(buttonComponent.props.loading).toBe(false)
  })

  it("renders correctly loading state", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.loading).toBe(true)
  })

  it("returns", async () => {
    mockFetchNotificationPermissions.mockImplementationOnce((cb) => cb(null, PushAuthorizationStatus.Authorized))

    const tree = renderWithWrappers(<TestRenderer />)
    const buttonComponent = tree.root.findByType(Button)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    act(() => buttonComponent.props.onPress())

    const createOperation = mockEnvironment.mock.getMostRecentOperation()

    expect(createOperation.request.node.operation.name).toEqual("SavedSearchBannerCreateSavedSearchMutation")
    expect(createOperation.request.variables).toEqual({
      input: {
        attributes,
      },
    })
    expect(buttonComponent.props.loading).toBe(true)

    act(() => mockEnvironment.mock.resolve(createOperation, MockPayloadGenerator.generate(createOperation)))

    const refetchOperation = mockEnvironment.mock.getMostRecentOperation()
    expect(refetchOperation.request.node.operation.name).toEqual("SavedSearchBannerRefetchQuery")

    act(() => mockEnvironment.mock.resolveMostRecentOperation({
      errors: [],
      data: {}
    }))

    const popoverMessageInstance = tree.root.findByType(PopoverMessage)
    const textInstances = popoverMessageInstance.findAllByType(Text)

    expect(textInstances[0].props.children).toEqual("Your alert has been set.")
    expect(textInstances[1].props.children).toEqual("We will send you a push notification once new works are added.")
  })
})
