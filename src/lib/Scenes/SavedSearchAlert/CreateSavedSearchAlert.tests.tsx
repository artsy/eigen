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
})
