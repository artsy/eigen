import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { mockFetchNotificationPermissions } from "app/tests/mockFetchNotificationPermissions"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import React from "react"
import { Alert } from "react-native"
import { createMockEnvironment } from "relay-test-utils"
import { SavedSearchAlertForm, SavedSearchAlertFormProps, tracks } from "./SavedSearchAlertForm"
import { SavedSearchStoreProvider } from "./SavedSearchStore"

const spyAlert = jest.spyOn(Alert, "alert")
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
const notificationPermissions = mockFetchNotificationPermissions(false)

const withoutDuplicateAlert = async () => {
  await waitFor(() => {
    const mutation = mockEnvironment.mock.getMostRecentOperation()
    expect(mutation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
  })

  // No duplicate alert
  resolveMostRecentRelayOperation(mockEnvironment, {
    Me: () => ({
      savedSearch: null,
    }),
  })
}

const TestRenderer = (props: Partial<SavedSearchAlertFormProps>) => {
  return (
    <SavedSearchStoreProvider initialData={{ attributes, aggregations, entity: savedSearchEntity }}>
      <SavedSearchAlertForm {...baseProps} {...props} />
    </SavedSearchStoreProvider>
  )
}

describe("Saved search alert form", () => {
  beforeEach(() => {
    spyAlert.mockClear()
    mockEnvironment.mockClear()
    notificationPermissions.mockImplementationOnce((cb) =>
      cb(null, PushAuthorizationStatus.Authorized)
    )
  })

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<TestRenderer />)
  })

  it("correctly renders default placeholder for input name", () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    expect(getByTestId("alert-input-name").props.placeholder).toEqual("Placeholder")
  })

  it("calls onComplete when mutation is completed", async () => {
    const onCompleteMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <TestRenderer onComplete={onCompleteMock} savedSearchAlertId="savedSearchAlertId" />
    )

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      resolveMostRecentRelayOperation(mockEnvironment)
    })

    expect(onCompleteMock).toHaveBeenCalled()
  })

  describe("Create flow", () => {
    it("calls create mutation when `Save Alert` buttin is pressed", async () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByTestId("alert-input-name"), "something new")
      fireEvent.press(getByTestId("save-alert-button"))

      await withoutDuplicateAlert()
      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()

        expect(mutation.request.node.operation.name).toBe("createSavedSearchAlertMutation")
        expect(mutation.request.variables).toEqual({
          input: {
            attributes: createMutationAttributes,
            userAlertSettings: {
              name: "something new",
              email: true,
              push: true,
            },
          },
        })
      })
    })

    it("should auto populate alert name for the create mutation", async () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer initialValues={{ ...baseProps.initialValues, name: "" }} />
      )

      fireEvent.press(getByTestId("save-alert-button"))

      await withoutDuplicateAlert()
      await waitFor(() => {
        expect(mockEnvironment.mock.getMostRecentOperation().request.variables).toMatchObject({
          input: {
            attributes,
            userAlertSettings: {
              name: "Placeholder",
            },
          },
        })
      })
    })
  })

  describe("Update flow", () => {
    it("should show a warning message if a user has disabled `Custom Alerts`", async () => {
      const { getByText } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" userAllowsEmails={false} />
      )

      expect(getByText("Change your email preferences")).toBeTruthy()
      expect(
        getByText("To receive Email Alerts, please update your email preferences.")
      ).toBeTruthy()
    })

    it("should auto populate alert name for edit mutation", async () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer
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
              name: `Placeholder`,
            },
          },
        })
      })
    })

    it("calls update mutation when `Save Alert` button is pressed", async () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      fireEvent.changeText(getByTestId("alert-input-name"), "something new")
      fireEvent.press(getByTestId("save-alert-button"))

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()

        expect(mutation.request.node.operation.name).toBe("updateSavedSearchAlertMutation")
        expect(mutation.request.variables).toEqual({
          input: {
            attributes,
            searchCriteriaID: "savedSearchAlertId",
            userAlertSettings: {
              name: "something new",
              email: true,
              push: true,
            },
          },
        })
      })
    })

    it("tracks analytics event when `Delete Alert` button is pressed", async () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      fireEvent.press(getByTestId("delete-alert-button"))
      fireEvent.press(getByTestId("dialog-primary-action-button"))

      await waitFor(() => {
        resolveMostRecentRelayOperation(mockEnvironment)
      })

      expect(mockTrackEvent).toHaveBeenCalledWith(tracks.deletedSavedSearch("savedSearchAlertId"))
    })

    it("tracks analytics event when `Save Alert` button is pressed", async () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      fireEvent.changeText(getByTestId("alert-input-name"), "something new")
      fireEvent.press(getByTestId("save-alert-button"))

      await waitFor(() => {
        resolveMostRecentRelayOperation(mockEnvironment)
      })

      expect(mockTrackEvent).toHaveBeenCalledWith(
        tracks.editedSavedSearch(
          "savedSearchAlertId",
          { name: "name", email: true, push: true },
          { name: "something new", email: true, push: true }
        )
      )
    })

    it("should render `Delete Alert` button", () => {
      const { getAllByTestId } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      expect(getAllByTestId("delete-alert-button")).toHaveLength(1)
    })

    it("calls delete mutation when the delete alert button is pressed", async () => {
      const onDeletePressMock = jest.fn()
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer
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
        resolveMostRecentRelayOperation(mockEnvironment)
      })

      expect(onDeletePressMock).toHaveBeenCalled()
    })
  })
})

describe("Notification toggles", () => {
  beforeEach(() => {
    spyAlert.mockClear()
    notificationPermissions.mockImplementationOnce((cb) => {
      cb(null, PushAuthorizationStatus.Authorized)
    })
  })

  it("toggles should be displayed", async () => {
    const { queryByText } = renderWithWrappersTL(<TestRenderer />)

    expect(queryByText("Email Alerts")).toBeTruthy()
    expect(queryByText("Mobile Alerts")).toBeTruthy()
  })

  it("state of toggles should be passed in mutation", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getByTestId("save-alert-button"))

    await withoutDuplicateAlert()
    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()
      expect(mutation.request.variables).toEqual({
        input: {
          attributes: createMutationAttributes,
          userAlertSettings: {
            name: "name",
            email: true,
            push: true,
          },
        },
      })
    })
  })

  it("state of email toggle should be passed to mutation", async () => {
    const { getByTestId, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", false)
    fireEvent.press(getByTestId("save-alert-button"))

    await withoutDuplicateAlert()
    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()
      expect(mutation.request.variables).toEqual({
        input: {
          attributes: createMutationAttributes,
          userAlertSettings: {
            name: "name",
            email: false,
            push: true,
          },
        },
      })
    })
  })

  it("state of push toggle should be passed to mutation", async () => {
    const { getByTestId, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    fireEvent(getByLabelText("Mobile Alerts Toggler"), "valueChange", false)
    fireEvent.press(getByTestId("save-alert-button"))

    await withoutDuplicateAlert()
    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()
      expect(mutation.request.variables).toEqual({
        input: {
          attributes: createMutationAttributes,
          userAlertSettings: {
            name: "name",
            email: true,
            push: false,
          },
        },
      })
    })
  })

  it("push toggle keeps in the same state when push permissions are denied", async () => {
    notificationPermissions.mockReset()
    notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Denied))

    const { getByLabelText, queryAllByA11yState } = renderWithWrappersTL(
      <TestRenderer initialValues={{ ...baseProps.initialValues, push: false, email: false }} />
    )

    await fireEvent(getByLabelText("Mobile Alerts Toggler"), "valueChange", true)

    expect(spyAlert).toBeCalled()
    expect(queryAllByA11yState({ selected: true })).toHaveLength(0)
  })

  it("push toggle keeps in the same state when push permissions are not not determined", async () => {
    notificationPermissions.mockReset()
    notificationPermissions.mockImplementation((cb) =>
      cb(null, PushAuthorizationStatus.NotDetermined)
    )

    const { getByLabelText, queryAllByA11yState } = renderWithWrappersTL(
      <TestRenderer initialValues={{ ...baseProps.initialValues, push: false, email: false }} />
    )

    await fireEvent(getByLabelText("Mobile Alerts Toggler"), "valueChange", true)

    expect(spyAlert).toBeCalled()
    expect(queryAllByA11yState({ selected: true })).toHaveLength(0)
  })

  it("push toggle turns on when push permissions are enabled", async () => {
    const { getByLabelText, queryAllByA11yState } = renderWithWrappersTL(
      <TestRenderer initialValues={{ ...baseProps.initialValues, push: false, email: false }} />
    )

    await fireEvent(getByLabelText("Mobile Alerts Toggler"), "valueChange", true)

    expect(spyAlert).not.toBeCalled()
    expect(queryAllByA11yState({ selected: true })).toHaveLength(1)
  })
})

describe("Allow to send emails modal", () => {
  beforeEach(() => {
    spyAlert.mockClear()
  })

  it("should display modal when the user enables email toggle", async () => {
    const { getByLabelText } = renderWithWrappersTL(
      <TestRenderer
        initialValues={{ ...baseProps.initialValues, push: false, email: false }}
        userAllowsEmails={false}
      />
    )

    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", true)

    expect(spyAlert).toBeCalled()
  })

  it("should display modal only once", async () => {
    // @ts-ignore
    spyAlert.mockImplementation((_title, _message, buttons) => buttons[1].onPress()) // Click "Accept" button

    const { getByLabelText } = renderWithWrappersTL(
      <TestRenderer
        initialValues={{ ...baseProps.initialValues, push: false, email: false }}
        userAllowsEmails={false}
      />
    )

    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", true)
    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", false)
    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", true)

    expect(spyAlert).toBeCalledTimes(1)
  })

  it("should not display modal if email toggle off and then back on", async () => {
    const { getByLabelText } = renderWithWrappersTL(<TestRenderer userAllowsEmails={false} />)

    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", true)
    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", false)
    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", true)

    expect(spyAlert).toBeCalledTimes(0)
  })

  it('should call update mutation if the user is tapped "Accept" button', async () => {
    // @ts-ignore
    spyAlert.mockImplementation((_title, _message, buttons) => buttons[1].onPress()) // Click "Accept" button

    const { getByLabelText, getByTestId } = renderWithWrappersTL(
      <TestRenderer
        initialValues={{ ...baseProps.initialValues, push: false, email: false }}
        userAllowsEmails={false}
      />
    )

    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", true)
    await fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()
      expect(mutation.request.node.operation.name).toEqual("updateNotificationPreferencesMutation")
      expect(mutation.request.variables).toEqual({
        input: { subscriptionGroups: [{ name: "custom_alerts", status: "SUBSCRIBED" }] },
      })
    })
  })

  it("should not call update email frequency mutation if the user previously opted out of emails and toggle was on by default", async () => {
    const { getByTestId } = renderWithWrappersTL(
      <TestRenderer
        savedSearchAlertId="savedSearchAlertId"
        initialValues={{ ...baseProps.initialValues, email: true }}
        userAllowsEmails={false}
      />
    )

    await fireEvent.changeText(getByTestId("alert-input-name"), "updated name")
    await fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()
      expect(mutation.request.node.operation.name).toEqual("updateSavedSearchAlertMutation")
    })
  })
})

describe("Pills", () => {
  it("should correctly render pills", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("artistName")).toBeTruthy()
    expect(getByText("Limited Edition")).toBeTruthy()
    expect(getByText("Tate Ward Auctions")).toBeTruthy()
    expect(getByText("New York, NY, USA")).toBeTruthy()
    expect(getByText("Photography")).toBeTruthy()
    expect(getByText("Prints")).toBeTruthy()
  })

  it("should have removable filter pills", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    // artist pill should appear and not be removable
    expect(getByText("artistName")).toBeTruthy()
    expect(getByText("artistName")).not.toHaveProp("onPress")

    fireEvent.press(getByText("Prints"))
    fireEvent.press(getByText("Photography"))

    waitForElementToBeRemoved(() => getByText("Prints"))
    waitForElementToBeRemoved(() => getByText("Photography"))
  })
})

describe("Save alert button", () => {
  describe("Create flow", () => {
    it("should be enabled by default", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

      expect(getByTestId("save-alert-button")).not.toBeDisabled()
    })

    it("should be enabled if selected at least one of toggles", () => {
      const { getByTestId, getByLabelText } = renderWithWrappersTL(
        <TestRenderer
          initialValues={{ ...baseProps.initialValues, name: "name", push: false, email: false }}
        />
      )

      fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", true)

      expect(getByTestId("save-alert-button")).not.toBeDisabled()
    })

    it("should be disabled if none of toggles have been selected", () => {
      const { getByTestId, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

      fireEvent(getByLabelText("Mobile Alerts Toggler"), "valueChange", false)
      fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", false)

      expect(getByTestId("save-alert-button")).toBeDisabled()
    })
  })

  describe("Update flow", () => {
    it("should be disabled by default", () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      expect(getByTestId("save-alert-button")).toBeDisabled()
    })

    it("should be disabled if no changes have been made by the user", () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer
          savedSearchAlertId="savedSearchAlertId"
          initialValues={{ ...baseProps.initialValues, name: "name" }}
        />
      )

      expect(getByTestId("save-alert-button")).toBeDisabled()
    })

    it("should be disabled if none of toggles have been selected", () => {
      const { getByTestId, getByLabelText } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      fireEvent(getByLabelText("Mobile Alerts Toggler"), "valueChange", false)
      fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", false)

      expect(getByTestId("save-alert-button")).toBeDisabled()
    })

    it("should be enabled if alert doesn't have name", () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer
          savedSearchAlertId="savedSearchAlertId"
          initialValues={{ ...baseProps.initialValues, name: "" }}
        />
      )

      expect(getByTestId("save-alert-button")).not.toBeDisabled()
    })

    it("should be enabled if changes have been made by the user", () => {
      const { getByTestId } = renderWithWrappersTL(
        <TestRenderer
          savedSearchAlertId="savedSearchAlertId"
          initialValues={{ ...baseProps.initialValues, name: "name" }}
        />
      )

      fireEvent.changeText(getByTestId("alert-input-name"), "updated name")

      expect(getByTestId("save-alert-button")).not.toBeDisabled()
    })

    it("should be enabled if filters are changed", () => {
      const { getByText, getAllByText } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      expect(getAllByText("Save Alert")[0]).toBeDisabled()
      fireEvent.press(getByText("Limited Edition"))
      expect(getAllByText("Save Alert")[0]).not.toBeDisabled()
    })

    it("should be enabled if selected at least one of toggles", () => {
      const { getByTestId, getByLabelText } = renderWithWrappersTL(
        <TestRenderer
          savedSearchAlertId="savedSearchAlertId"
          initialValues={{ ...baseProps.initialValues, name: "name", push: false, email: false }}
        />
      )

      fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", true)

      expect(getByTestId("save-alert-button")).not.toBeDisabled()
    })
  })
})

describe("Email preferences", () => {
  it("should display email `Update email preferences` link only when email toggle is enabled", async () => {
    const { queryByText, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    expect(queryByText("Update email preferences")).toBeTruthy()
    await fireEvent(getByLabelText("Email Alerts Toggler"), "valueChange", false)
    expect(queryByText("Update email preferences")).toBeFalsy()
  })

  it("should call navigate handler when `Update email preferences` link is pressed", async () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getByText("Update email preferences"))

    expect(navigate).toBeCalledWith("/unsubscribe", {
      passProps: {
        backProps: {
          previousScreen: "Unsubscribe",
        },
      },
    })
  })

  it("should call custom handler when it is passed", async () => {
    const onUpdateEmailPreferencesMock = jest.fn()
    const { getByText } = renderWithWrappersTL(
      <TestRenderer onUpdateEmailPreferencesPress={onUpdateEmailPreferencesMock} />
    )

    fireEvent.press(getByText("Update email preferences"))

    expect(onUpdateEmailPreferencesMock).toBeCalled()
  })
})

describe("Checking for a duplicate alert", () => {
  beforeEach(() => {
    spyAlert.mockClear()
    mockEnvironment.mockClear()
  })

  describe("Create flow", () => {
    it("should call create mutation without a warning message", async () => {
      const { getAllByText } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.press(getAllByText("Save Alert")[0])

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
      })

      // No duplicate alert
      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          savedSearch: null,
        }),
      })

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("createSavedSearchAlertMutation")
      })
    })

    it("should display a warning message if there is a duplicate", async () => {
      const { getAllByText } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.press(getAllByText("Save Alert")[0])

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
      })

      resolveMostRecentRelayOperation(mockEnvironment)

      await waitFor(() => expect(spyAlert.mock.calls[0][0]).toBe("Duplicate Alert"))
    })

    it('should call create mutation when "Replace" button is pressed', async () => {
      // @ts-ignore
      spyAlert.mockImplementation((_title, _message, buttons) => buttons[0].onPress()) // Click "Replace" button

      const { getAllByText } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.press(getAllByText("Save Alert")[0])

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
      })

      resolveMostRecentRelayOperation(mockEnvironment)

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("createSavedSearchAlertMutation")
      })
    })
  })

  describe("Update flow", () => {
    it("should call update mutation without a warning message", async () => {
      const { getAllByText, getByText } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      fireEvent.press(getByText("Prints"))
      fireEvent.press(getAllByText("Save Alert")[0])

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
      })

      // No duplicate alert
      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          savedSearch: null,
        }),
      })

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("updateSavedSearchAlertMutation")
      })
    })

    it("should display a warning message if there is a duplicate and user is able to view duplicate alert", async () => {
      // @ts-ignore
      spyAlert.mockImplementation((_title, _message, buttons) => buttons[1].onPress()) // Click "View Duplicate" button

      const { getAllByText, getByText } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      fireEvent.press(getByText("Prints"))
      fireEvent.press(getAllByText("Save Alert")[0])

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
      })

      resolveMostRecentRelayOperation(mockEnvironment)

      await waitFor(() => expect(spyAlert.mock.calls[0][0]).toBe("Duplicate Alert"))

      expect(navigate).toBeCalledWith("/my-profile/saved-search-alerts/internalID-1")
    })

    it('should call update mutation when "Replace" button is pressed', async () => {
      // @ts-ignore
      spyAlert.mockImplementation((_title, _message, buttons) => buttons[0].onPress()) // Click "Replace" button

      const { getAllByText, getByText } = renderWithWrappersTL(
        <TestRenderer savedSearchAlertId="savedSearchAlertId" />
      )

      fireEvent.press(getByText("Prints"))
      fireEvent.press(getAllByText("Save Alert")[0])

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
      })

      resolveMostRecentRelayOperation(mockEnvironment)

      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.fragment.node.name).toBe("updateSavedSearchAlertMutation")
      })
    })
  })
})

const savedSearchEntity: SavedSearchEntity = {
  placeholder: "Placeholder",
  artists: [{ id: "artistID", name: "artistName" }],
  owner: {
    type: OwnerType.artist,
    id: "ownerId",
    slug: "ownerSlug",
  },
}
const attributes: SearchCriteriaAttributes = {
  artistIDs: ["artistID"],
  attributionClass: ["limited edition"],
  partnerIDs: ["tate-ward-auctions"],
  locationCities: ["New York, NY, USA"],
  additionalGeneIDs: ["photography", "prints"],
}
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

const createMutationAttributes = {
  artistIDs: ["artistID"],
  attributionClass: ["limited edition"],
  partnerIDs: ["tate-ward-auctions"],
  locationCities: ["New York, NY, USA"],
  additionalGeneIDs: ["photography", "prints"],
}

const baseProps: SavedSearchAlertFormProps = {
  initialValues: {
    name: "name",
    email: true,
    push: true,
  },
  userAllowsEmails: true,
}
