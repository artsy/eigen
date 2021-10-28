import { fireEvent, waitFor } from "@testing-library/react-native"
import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { mockFetchNotificationPermissions } from "lib/tests/mockFetchNotificationPermissions"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { PushAuthorizationStatus } from "lib/utils/PushNotification"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { CreateSavedSearchAlert, CreateSavedSearchAlertProps } from "./CreateSavedSearchAlert"

jest.unmock("react-relay")

const defaultProps: CreateSavedSearchAlertProps = {
  visible: true,
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
  userAllowEmails: true,
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

  it("renders without throwing an error", () => {
    const { getAllByTestId } = renderWithWrappersTL(<CreateSavedSearchAlert {...defaultProps} />)

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual(["Bid"])
  })

  it("should display description by default", () => {
    const { getByText } = renderWithWrappersTL(<CreateSavedSearchAlert {...defaultProps} />)
    const description = getByText("Receive alerts as Push Notifications directly to your device.")

    expect(description).toBeTruthy()
  })

  it("should hide description when AREnableSavedSearchToggles is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchToggles: true })
    const { queryByText } = renderWithWrappersTL(<CreateSavedSearchAlert {...defaultProps} />)
    const description = queryByText("Receive alerts as Push Notifications directly to your device.")

    expect(description).toBeFalsy()
  })

  it("should call onClosePress handler when the close button is pressed", () => {
    const onCloseMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <CreateSavedSearchAlert {...defaultProps} onClosePress={onCloseMock} />
    )

    fireEvent.press(getByTestId("fancy-modal-header-left-button"))

    expect(onCloseMock).toBeCalled()
  })

  it("calls onComplete when the mutation is completed", async () => {
    notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))
    const onCompleteMock = jest.fn()

    const { getByTestId } = renderWithWrappersTL(
      <CreateSavedSearchAlert {...defaultProps} onComplete={onCompleteMock} />
    )

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
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

      const { findAllByA11yState } = renderWithWrappersTL(<CreateSavedSearchAlert {...defaultProps} />)
      const toggles = await findAllByA11yState({ selected: true })

      expect(toggles).toHaveLength(2)
    })

    it("the push notification is disabled by default when push permissions are denied", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Denied))

      const { findAllByA11yState } = renderWithWrappersTL(<CreateSavedSearchAlert {...defaultProps} />)
      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })

    it("the push notification is disabled by default when push permissions are not determined", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.NotDetermined))

      const { findAllByA11yState } = renderWithWrappersTL(<CreateSavedSearchAlert {...defaultProps} />)
      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })

    it("the email notification is disabled by default if a user has not allowed email notifications", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))

      const { findAllByA11yState } = renderWithWrappersTL(
        <CreateSavedSearchAlert {...defaultProps} userAllowEmails={false} />
      )
      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })
  })
})
