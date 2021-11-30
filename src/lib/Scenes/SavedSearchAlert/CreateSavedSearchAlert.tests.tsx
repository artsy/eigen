import { fireEvent, waitFor } from "@testing-library/react-native"
import { CreateSavedSearchAlertTestsQuery } from "__generated__/CreateSavedSearchAlertTestsQuery.graphql"
import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { mockFetchNotificationPermissions } from "lib/tests/mockFetchNotificationPermissions"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { PushAuthorizationStatus } from "lib/utils/PushNotification"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { CreateSavedSearchAlert } from "./CreateSavedSearchAlert"
import { CreateSavedSearchAlertParams, CreateSavedSearchAlertProps } from "./SavedSearchAlertModel"

jest.unmock("react-relay")

const defaultParams: CreateSavedSearchAlertParams = {
  filters: [
    {
      displayText: "Bid",
      paramName: FilterParamName.waysToBuyBid,
      paramValue: true,
    },
  ],
  aggregations: [],
  artistId: "artistID",
  artistName: "artistName",
  onComplete: jest.fn(),
  onClosePress: jest.fn(),
}

describe("CreateSavedSearchAlert", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment.mockClear()
    notificationPermissions.mockClear()
  })

  const TestRenderer = (props: Partial<CreateSavedSearchAlertProps>) => {
    return (
      <QueryRenderer<CreateSavedSearchAlertTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query CreateSavedSearchAlertTestsQuery @relay_test_operation {
            me {
              ...CreateSavedSearchAlertScreen_me
            }
          }
        `}
        render={({ props: relayProps }) => {
          if (relayProps?.me) {
            return (
              <CreateSavedSearchAlert
                visible
                params={{
                  ...defaultParams,
                  // @ts-ignore
                  me: relayProps?.me,
                }}
                {...props}
              />
            )
          }
        }}
        variables={{}}
      />
    )
  }

  const renderAndExecuteQuery = (props?: Partial<CreateSavedSearchAlertProps>, mockResolvers?: MockResolvers) => {
    const render = renderWithWrappersTL(<TestRenderer {...props} />)

    // CreateSavedSearchAlertTestsQuery
    mockEnvironmentPayload(mockEnvironment, mockResolvers)

    return render
  }

  it("renders without throwing an error", () => {
    const { getAllByTestId } = renderAndExecuteQuery()

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual(["Bid"])
  })

  it("should call onClosePress handler when the close button is pressed", () => {
    const onCloseMock = jest.fn()
    const { getByTestId } = renderAndExecuteQuery({
      params: {
        ...defaultParams,
        onClosePress: onCloseMock,
      },
    })

    fireEvent.press(getByTestId("fancy-modal-header-left-button"))

    expect(onCloseMock).toBeCalled()
  })

  it("calls onComplete when the mutation is completed", async () => {
    notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))
    const onCompleteMock = jest.fn()

    const { getByTestId } = renderAndExecuteQuery({
      params: {
        ...defaultParams,
        onComplete: onCompleteMock,
      },
    })

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()

      expect(operation.request.node.operation.name).toBe("createSavedSearchAlertMutation")
      mockEnvironmentPayload(mockEnvironment, {
        SearchCriteria: () => ({
          internalID: "internalID",
        }),
      })
    })

    expect(onCompleteMock).toHaveBeenCalledWith({
      id: "internalID",
    })
  })

  describe("When AREnableSavedSearchToggles is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchToggles: true })
    })

    it("the push notification is enabled by default when push permissions are enabled", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))

      const { findAllByA11yState } = renderAndExecuteQuery()

      // Refetch query
      mockEnvironmentPayload(mockEnvironment)

      const toggles = await findAllByA11yState({ selected: true })

      expect(toggles).toHaveLength(2)
    })

    it("the push notification is disabled by default when push permissions are denied", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Denied))

      const { findAllByA11yState } = renderAndExecuteQuery()

      // Refetch query
      mockEnvironmentPayload(mockEnvironment)

      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })

    it("the push notification is disabled by default when push permissions are not determined", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.NotDetermined))

      const { findAllByA11yState } = renderAndExecuteQuery()
      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })

    it("the email notification is disabled by default if a user has not allowed email notifications", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))
      const mockResolver = {
        Me: () => ({
          emailFrequency: "none",
        }),
      }

      const { findAllByA11yState } = renderAndExecuteQuery({}, mockResolver)

      // Refetch query
      mockEnvironmentPayload(mockEnvironment, mockResolver)

      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })
  })
})
