import { ToggledSavedSearch } from "@artsy/cohesion"
import { SearchCriteriaAttributes } from "__generated__/SavedSearchBannerQuery.graphql"
import { SavedSearchBannerTestsQuery } from "__generated__/SavedSearchBannerTestsQuery.graphql"
import { PopoverMessage } from "lib/Components/PopoverMessage/PopoverMessage"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button, Text } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SavedSearchBannerRefetchContainer, tracks } from "../SavedSearchBanner"

jest.unmock("react-relay")

interface Mutation {
  name: string
  variables: Record<string, any>
}
interface Popover {
  title: string
  message: string
}

const mockFetchNotificationPermissions = LegacyNativeModules.ARTemporaryAPIModule
  .fetchNotificationPermissions as jest.Mock<any>

describe("SavedSearchBanner", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const attributes: SearchCriteriaAttributes = {
    acquireable: true,
  }
  const trackEvent = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    trackEvent.mockClear()
  })

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
            artistSlug="some-slug"
          />
        )}
        variables={{
          criteria: attributes,
        }}
      />
    )
  }

  const checkLogicForMutations = (
    mockResolvers = {},
    mutation: Mutation,
    popover: Popover,
    analyticsPayload: ToggledSavedSearch
  ) => {
    mockFetchNotificationPermissions.mockImplementationOnce((cb) => cb(null, PushAuthorizationStatus.Authorized))

    const tree = renderWithWrappers(<TestRenderer />)
    const buttonComponent = tree.root.findByType(Button)

    mockEnvironmentPayload(mockEnvironment, mockResolvers)

    act(() => buttonComponent.props.onPress())

    const createOperation = mockEnvironment.mock.getMostRecentOperation()

    expect(buttonComponent.props.loading).toBe(true)
    expect(createOperation.request.node.operation.name).toEqual(mutation.name)
    expect(createOperation.request.variables).toEqual(mutation.variables)

    act(() => mockEnvironment.mock.resolve(createOperation, MockPayloadGenerator.generate(createOperation)))

    const refetchOperation = mockEnvironment.mock.getMostRecentOperation()
    expect(refetchOperation.request.node.operation.name).toEqual("SavedSearchBannerRefetchQuery")

    act(() => mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate(refetchOperation)))

    const popoverMessageInstance = tree.root.findByType(PopoverMessage)
    const textInstances = popoverMessageInstance.findAllByType(Text)

    expect(textInstances[0].props.children).toEqual(popover.title)
    expect(textInstances[1].props.children).toEqual(popover.message)

    expect(trackEvent).toHaveBeenCalledWith(analyticsPayload)
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

  it("createSavedSearch mutation is handled correctly", async () => {
    const mockResolvers = {
      Me: () => ({
        savedSearch: null,
      }),
    }
    const mutation: Mutation = {
      name: "SavedSearchBannerCreateSavedSearchMutation",
      variables: {
        input: {
          attributes,
        },
      },
    }
    const popover: Popover = {
      title: "Your alert has been set.",
      message: "We will send you a push notification once new works are added.",
    }

    const analyticsPayload = tracks.toggleSavedSearch(
      true,
      "banksy",
      "some-slug",
      '<mock-value-for-field-"internalID">'
    )
    checkLogicForMutations(mockResolvers, mutation, popover, analyticsPayload)
  })

  it("deleteSavedSearch mutation is handled correctly", async () => {
    const savedSearchCriteriaId = "some-unique-name"
    const mockResolvers = {
      Me: () => ({
        savedSearch: {
          internalID: savedSearchCriteriaId,
        },
      }),
    }
    const mutation: Mutation = {
      name: "SavedSearchBannerDeleteSavedSearchMutation",
      variables: {
        input: {
          searchCriteriaID: savedSearchCriteriaId,
        },
      },
    }
    const popover: Popover = {
      title: "Your alert has been removed.",
      message: "Don't worry, you can always create a new one.",
    }

    const analyticsPayload = tracks.toggleSavedSearch(
      false,
      "banksy",
      "some-slug",
      '<mock-value-for-field-"internalID">'
    )
    checkLogicForMutations(mockResolvers, mutation, popover, analyticsPayload)
  })
})
