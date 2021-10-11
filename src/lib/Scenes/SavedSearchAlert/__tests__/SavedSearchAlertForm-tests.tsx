import { fireEvent, waitFor } from "@testing-library/react-native"
import { Aggregations, FilterData, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { mockFetchNotificationPermissions } from "lib/tests/mockFetchNotificationPermissions"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { PushAuthorizationStatus } from "lib/utils/PushNotification"
import { bullet } from "palette"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { SavedSearchAlertForm, SavedSearchAlertFormProps, tracks } from "../SavedSearchAlertForm"

describe("Saved search alert form", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment.mockClear()
    notificationPermissions.mockImplementationOnce((cb) => cb(null, PushAuthorizationStatus.Authorized))
  })

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)
  })

  it("correctly renders placeholder for input name", () => {
    const { getByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    expect(getByTestId("alert-input-name").props.placeholder).toEqual(`artistName ${bullet} 5 filters`)
  })

  it("correctly extracts the values of pills", () => {
    const { getAllByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual([
      "Limited Edition",
      "Tate Ward Auctions",
      "New York, NY, USA",
      "Photography",
      "Prints",
    ])
  })

  it(`should render "Delete Alert" button when the savedSearchAlertId is passed`, () => {
    const { getAllByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} savedSearchAlertId="savedSearchAlertId" />
    )

    expect(getAllByTestId("delete-alert-button")).toHaveLength(1)
  })

  it("calls update mutation when form is submitted", async () => {
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} savedSearchAlertId="savedSearchAlertId" />
    )

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()

      expect(mutation.request.node.operation.name).toBe("updateSavedSearchAlertMutation")
      expect(mutation.request.variables).toEqual({
        input: {
          searchCriteriaID: "savedSearchAlertId",
          userAlertSettings: {
            name: "something new",
          },
        },
      })
    })
  })

  it("tracks the edited saved search event when the save alert button is pressed", async () => {
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} savedSearchAlertId="savedSearchAlertId" />
    )

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      mockEnvironmentPayload(mockEnvironment)
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(
      tracks.editedSavedSearch(
        "savedSearchAlertId",
        { name: "", enableEmailNotifications: true, enablePushNotifications: true },
        { name: "something new", enableEmailNotifications: true, enablePushNotifications: true }
      )
    )
  })

  it("calls create mutation when form is submitted", async () => {
    const { getByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()

      expect(mutation.request.node.operation.name).toBe("createSavedSearchAlertMutation")
      expect(mutation.request.variables).toEqual({
        input: {
          attributes: {
            artistID: "artistID",
            attributionClass: ["limited edition"],
            partnerIDs: ["tate-ward-auctions"],
            locationCities: ["New York, NY, USA"],
            additionalGeneIDs: ["photography", "prints"],
          },
          userAlertSettings: {
            name: "something new",
          },
        },
      })
    })
  })

  it("calls onComplete when the mutation is completed", async () => {
    const onCompleteMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} onComplete={onCompleteMock} savedSearchAlertId="savedSearchAlertId" />
    )

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      mockEnvironmentPayload(mockEnvironment)
    })

    expect(onCompleteMock).toHaveBeenCalled()
  })

  it("calls delete mutation when the delete alert button is pressed", async () => {
    const onDeletePressMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm
        {...baseProps}
        savedSearchAlertId="savedSearchAlertId"
        onDeleteComplete={onDeletePressMock}
      />
    )

    fireEvent.press(getByTestId("delete-alert-button"))
    fireEvent.press(getByTestId("dialog-primary-action-button"))

    expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "deleteSavedSearchAlertMutation"
    )

    await waitFor(() => {
      mockEnvironmentPayload(mockEnvironment)
    })

    expect(onDeletePressMock).toHaveBeenCalled()
  })

  it("tracks clicks when the delete alert button is pressed", async () => {
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} savedSearchAlertId="savedSearchAlertId" />
    )

    fireEvent.press(getByTestId("delete-alert-button"))
    fireEvent.press(getByTestId("dialog-primary-action-button"))

    await waitFor(() => {
      mockEnvironmentPayload(mockEnvironment)
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(tracks.deletedSavedSearch("savedSearchAlertId"))
  })

  it("should auto populate alert name for the create mutation", async () => {
    const { getByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      expect(mockEnvironment.mock.getMostRecentOperation().request.variables).toMatchObject({
        input: {
          userAlertSettings: {
            name: "artistName • 5 filters",
          },
        },
      })
    })
  })

  it("should auto populate alert name for the update mutation", async () => {
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm
        {...baseProps}
        savedSearchAlertId="savedSearchAlertId"
        initialValues={{ ...baseProps.initialValues, name: "update value" }}
      />
    )

    fireEvent.changeText(getByTestId("alert-input-name"), "")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      expect(mockEnvironment.mock.getMostRecentOperation().request.variables).toMatchObject({
        input: {
          userAlertSettings: {
            name: `artistName ${bullet} 5 filters`,
          },
        },
      })
    })
  })

  it("should hide notification toggles if AREnableSavedSearchToggles is disabled", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchToggles: false })
    const { queryByText } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    expect(queryByText("Email Alerts")).toBeFalsy()
    expect(queryByText("Mobile Alerts")).toBeFalsy()
  })

  it("should display notification toggles if AREnableSavedSearchToggles is enabled", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchToggles: true })
    const { queryByText } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    expect(queryByText("Email Alerts")).toBeTruthy()
    expect(queryByText("Mobile Alerts")).toBeTruthy()
  })

  it('should check Push notification permissions when "the mobile alerts toggle" is enabled', async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchToggles: true })
    const notificationPermissionsMock = mockFetchNotificationPermissions(false)

    const { getByA11yLabel } = renderWithWrappersTL(
      <SavedSearchAlertForm
        {...baseProps}
        initialValues={{ ...baseProps.initialValues, enablePushNotifications: false }}
      />
    )

    fireEvent(getByA11yLabel("Mobile Alerts Toggler"), "valueChange", true)

    expect(notificationPermissionsMock).toBeCalled()
  })

  it("should immediately call mutation if AREnableSavedSearchToggles is enabled", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchToggles: true })
    mockFetchNotificationPermissions(false)

    const { getByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()
      expect(mutation).toBeTruthy()
    })
  })
})

const filters: FilterData[] = [
  {
    paramName: FilterParamName.attributionClass,
    displayText: "Limited Edition",
    paramValue: ["limited edition"],
  },
  {
    paramName: FilterParamName.partnerIDs,
    displayText: "Tate Ward Auctions",
    paramValue: ["tate-ward-auctions"],
  },
  {
    paramName: FilterParamName.locationCities,
    displayText: "New York, NY, USA",
    paramValue: ["New York, NY, USA"],
  },
  {
    paramName: FilterParamName.additionalGeneIDs,
    displayText: "Photography, Prints",
    paramValue: ["photography", "prints"],
  },
]

const aggregations: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [
      {
        count: 18037,
        name: "Photography",
        value: "photography",
      },
      {
        count: 2420,
        name: "Prints",
        value: "prints",
      },
      {
        count: 513,
        name: "Ephemera or Merchandise",
        value: "ephemera-or-merchandise",
      },
    ],
  },
  {
    slice: "LOCATION_CITY",
    counts: [
      {
        count: 18242,
        name: "New York, NY, USA",
        value: "New York, NY, USA",
      },
      {
        count: 322,
        name: "London, United Kingdom",
        value: "London, United Kingdom",
      },
    ],
  },
  {
    slice: "PARTNER",
    counts: [
      {
        count: 18210,
        name: "Cypress Test Partner [For Automated Testing Purposes]",
        value: "cypress-test-partner-for-automated-testing-purposes",
      },
      {
        count: 578,
        name: "Tate Ward Auctions",
        value: "tate-ward-auctions",
      },
    ],
  },
]

const baseProps: SavedSearchAlertFormProps = {
  initialValues: {
    name: "",
    enableEmailNotifications: true,
    enablePushNotifications: true,
  },
  filters,
  aggregations,
  artistId: "artistID",
  artistName: "artistName",
}
