import { OwnerType } from "@artsy/cohesion"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import {
  SavedSearchAlertForm,
  SavedSearchAlertFormProps,
  tracks,
} from "app/Scenes/SavedSearchAlert/SavedSearchAlertForm"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSavedSearchPills } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"
import { navigate } from "app/system/navigation/navigate"
import { PushAuthorizationStatus } from "app/system/notifications/getNotificationsPermissions"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { mockFetchNotificationPermissions } from "app/utils/tests/mockFetchNotificationPermissions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Alert } from "react-native"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Scenes/SavedSearchAlert/useSavedSearchPills")

describe("SavedSearchAlertForm", () => {
  const spyAlert = jest.spyOn(Alert, "alert")
  const notificationPermissions = mockFetchNotificationPermissions()

  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
    ;(useSavedSearchPills as jest.Mock).mockImplementation(() => pills)
  })

  const waitForPendingOperation = () =>
    waitFor(() => expect(mockEnvironment.mock.getAllOperations()).not.toHaveLength(0))

  // palette's Dialog runs a 150ms fade-out on mount and hides itself when that animation ends.
  // Opening the dialog stops the fade-out early, which ends it and hides the dialog again, so
  // let the initial fade-out finish before opening the delete dialog.
  const waitForDialogFadeOut = () => act(() => new Promise((resolve) => setTimeout(resolve, 200)))

  afterEach(() => {
    jest.clearAllMocks()
  })

  const withoutDuplicateAlert = async () => {
    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()
      expect(mutation.fragment.node.name).toBe("getAlertByCriteriaQuery")
    })

    // No duplicate alert
    await resolveMostRecentRelayOperation(mockEnvironment, {
      Alert: () => ({
        internalID: null,
      }),
    })
  }

  const TestRenderer = (props: Partial<SavedSearchAlertFormProps>) => {
    return (
      <SavedSearchStoreProvider
        runtimeModel={{
          ...savedSearchModel,
          attributes: attributes as SearchCriteriaAttributes,
          entity: savedSearchEntity,
        }}
      >
        <SavedSearchAlertForm {...baseProps} {...props} />
      </SavedSearchStoreProvider>
    )
  }

  describe("Saved search alert form", () => {
    beforeEach(() => {
      spyAlert.mockClear()
      mockEnvironment.mockClear()
      notificationPermissions.mockImplementationOnce(() =>
        Promise.resolve(PushAuthorizationStatus.Authorized)
      )
    })

    it("renders without throwing an error", async () => {
      await renderWithWrappers(<TestRenderer />)
    })

    it("calls onComplete when mutation is completed", async () => {
      const onCompleteMock = jest.fn()
      await renderWithWrappers(
        <TestRenderer onComplete={onCompleteMock} savedSearchAlertId="savedSearchAlertId" />
      )

      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment)

      await fireEvent.changeText(screen.getByTestId("alert-input-details"), "something new")
      await fireEvent.press(screen.getByTestId("save-alert-button"))

      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment)

      expect(onCompleteMock).toHaveBeenCalled()
    })

    describe("Create flow", () => {
      it("calls create mutation when `Create Alert` button is pressed", async () => {
        await renderWithWrappers(<TestRenderer />)

        await fireEvent.changeText(screen.getByTestId("alert-input-details"), "something new")
        await fireEvent.changeText(
          screen.getByTestId("alert-input-details"),
          "I'm looking for signed works by Damon Zucconi"
        )
        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await withoutDuplicateAlert()
        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()

          expect(mutation.request.node.operation.name).toBe("createSavedSearchAlertMutation")
        })

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()

          expect(mutation.request.variables).toEqual({
            input: {
              ...createMutationAttributes,
              settings: {
                name: "name",
                email: true,
                push: true,
                details: "I'm looking for signed works by Damon Zucconi",
              },
            },
          })
        })
      })

      it("should auto populate alert name for the create mutation", async () => {
        await renderWithWrappers(
          <TestRenderer initialValues={{ ...baseProps.initialValues, name: "" }} />
        )

        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await withoutDuplicateAlert()
        await waitFor(() => {
          expect(mockEnvironment.mock.getMostRecentOperation().request.variables).toMatchObject({
            input: {
              settings: {
                name: "",
              },
            },
          })
        })
      })
    })

    describe("Update flow", () => {
      it("should show a warning message if a user has disabled `Custom Alerts`", async () => {
        await renderWithWrappers(
          <TestRenderer savedSearchAlertId="savedSearchAlertId" userAllowsEmails={false} />
        )

        expect(screen.getByText("Change your email preferences")).toBeTruthy()
        expect(
          screen.getByText("To receive alerts via email, please update your email preferences.")
        ).toBeTruthy()
      })

      it("should auto populate alert name for edit mutation", async () => {
        await renderWithWrappers(
          <TestRenderer
            savedSearchAlertId="savedSearchAlertId"
            initialValues={{ ...baseProps.initialValues, name: "update value" }}
          />
        )

        await fireEvent.changeText(screen.getByTestId("alert-input-details"), "")
        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await waitFor(() => {
          expect(mockEnvironment.mock.getMostRecentOperation().request.variables).toMatchObject({
            input: {
              settings: {
                name: "update value",
              },
            },
          })
        })
      })

      it("calls update mutation when `Save Alert` button is pressed", async () => {
        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        await fireEvent.changeText(screen.getByTestId("alert-input-details"), "something new")
        await fireEvent.changeText(
          screen.getByTestId("alert-input-details"),
          "I'm looking for signed works by Damon Zucconi"
        )
        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()

          expect(mutation.request.node.operation.name).toBe("updateSavedSearchAlertMutation")
        })

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()

          expect(mutation.request.variables).toEqual({
            input: {
              ...attributes,
              id: "savedSearchAlertId",
              settings: {
                name: "name",
                email: true,
                push: true,
                details: "I'm looking for signed works by Damon Zucconi",
              },
            },
          })
        })
      })

      it("tracks analytics event when `Delete Alert` button is pressed", async () => {
        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        await waitForDialogFadeOut()

        await fireEvent.press(screen.getByTestId("delete-alert-button"))
        await fireEvent.press(screen.getByTestId("dialog-primary-action-button"))

        await waitForPendingOperation()
        await resolveMostRecentRelayOperation(mockEnvironment)

        expect(mockTrackEvent).toHaveBeenCalledWith(tracks.deletedSavedSearch("savedSearchAlertId"))
      })

      it("tracks analytics event when `Save Alert` button is pressed", async () => {
        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        await waitForPendingOperation()
        await resolveMostRecentRelayOperation(mockEnvironment)

        await fireEvent.changeText(screen.getByTestId("alert-input-details"), "something new")
        await fireEvent.changeText(
          screen.getByTestId("alert-input-details"),
          "I'm looking for signed works by Damon Zucconi"
        )
        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await waitForPendingOperation()
        await resolveMostRecentRelayOperation(mockEnvironment)

        expect(mockTrackEvent).toHaveBeenCalledWith(
          tracks.editedSavedSearch(
            "savedSearchAlertId",
            { name: "name", email: true, push: true },
            {
              name: "name",
              email: true,
              push: true,
              details: "I'm looking for signed works by Damon Zucconi",
            }
          )
        )
      })

      it("should render `Delete Alert` button", async () => {
        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        expect(screen.getAllByTestId("delete-alert-button")).toHaveLength(1)
      })

      it("calls delete mutation when the delete alert button is pressed", async () => {
        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        await waitForDialogFadeOut()

        await fireEvent.press(screen.getByTestId("delete-alert-button"))
        await fireEvent.press(screen.getByTestId("dialog-primary-action-button"))

        expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
          "deleteSavedSearchAlertMutation"
        )
      })
    })
  })

  describe("Notification toggles", () => {
    beforeEach(() => {
      spyAlert.mockClear()
      notificationPermissions.mockImplementationOnce(() =>
        Promise.resolve(PushAuthorizationStatus.Authorized)
      )
    })

    it("toggles should be displayed", async () => {
      await renderWithWrappers(<TestRenderer />)

      expect(screen.getByText("Email")).toBeTruthy()
      expect(screen.getByText("Push Notifications")).toBeTruthy()
    })

    it("state of toggles should be passed in mutation", async () => {
      await renderWithWrappers(<TestRenderer />)

      await fireEvent.press(screen.getByTestId("save-alert-button"))

      await withoutDuplicateAlert()
      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.request.variables).toEqual({
          input: {
            ...createMutationAttributes,
            settings: {
              name: "name",
              email: true,
              push: true,
            },
          },
        })
      })
    })

    it("state of email toggle should be passed to mutation", async () => {
      await renderWithWrappers(<TestRenderer />)

      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", false)
      await fireEvent.press(screen.getByTestId("save-alert-button"))

      await withoutDuplicateAlert()
      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.request.variables).toEqual({
          input: {
            ...createMutationAttributes,
            settings: {
              name: "name",
              email: false,
              push: true,
            },
          },
        })
      })
    })

    it("state of push toggle should be passed to mutation", async () => {
      await renderWithWrappers(<TestRenderer />)

      await fireEvent(screen.getByLabelText("Push Notifications Toggler"), "valueChange", false)
      await fireEvent.press(screen.getByTestId("save-alert-button"))

      await withoutDuplicateAlert()
      await waitFor(() => {
        const mutation = mockEnvironment.mock.getMostRecentOperation()
        expect(mutation.request.variables).toEqual({
          input: {
            ...createMutationAttributes,
            settings: {
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
      notificationPermissions.mockImplementation(() =>
        Promise.resolve(PushAuthorizationStatus.Denied)
      )

      await renderWithWrappers(
        <TestRenderer initialValues={{ ...baseProps.initialValues, push: false, email: false }} />
      )

      await fireEvent(screen.getByLabelText("Push Notifications Toggler"), "valueChange", true)

      await flushPromiseQueue()

      expect(spyAlert).toBeCalled()

      expect(screen.getByLabelText("Push Notifications Toggler")).not.toBeSelected()
    })

    it("push toggle keeps in the same state when push permissions are not not determined", async () => {
      notificationPermissions.mockReset()
      notificationPermissions.mockImplementation(() =>
        Promise.resolve(PushAuthorizationStatus.NotDetermined)
      )

      await renderWithWrappers(
        <TestRenderer initialValues={{ ...baseProps.initialValues, push: false, email: false }} />
      )

      await fireEvent(screen.getByLabelText("Push Notifications Toggler"), "valueChange", true)

      await flushPromiseQueue()

      expect(spyAlert).toBeCalled()

      expect(screen.getByLabelText("Push Notifications Toggler")).not.toBeSelected()
    })
  })

  describe("Allow to send emails modal", () => {
    beforeEach(() => {
      spyAlert.mockClear()
    })

    it("should display modal when the user enables email toggle", async () => {
      await renderWithWrappers(
        <TestRenderer
          initialValues={{ ...baseProps.initialValues, push: false, email: false }}
          userAllowsEmails={false}
        />
      )

      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", true)

      await flushPromiseQueue()

      expect(spyAlert).toBeCalled()
    })

    it("should display modal only once", async () => {
      // @ts-ignore
      spyAlert.mockImplementation((_title, _message, buttons) => buttons[1].onPress()) // Click "Accept" button

      await renderWithWrappers(
        <TestRenderer
          initialValues={{ ...baseProps.initialValues, push: false, email: false }}
          userAllowsEmails={false}
        />
      )

      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", true)
      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", false)
      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", true)

      await flushPromiseQueue()

      expect(spyAlert).toBeCalledTimes(1)
    })

    it("should not display modal if email toggle off and then back on", async () => {
      await renderWithWrappers(<TestRenderer userAllowsEmails={false} />)

      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", true)
      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", false)
      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", true)

      await flushPromiseQueue()

      expect(spyAlert).toBeCalledTimes(0)
    })

    it('should call update mutation if the user is tapped "Accept" button', async () => {
      // @ts-ignore
      spyAlert.mockImplementation((_title, _message, buttons) => buttons[1].onPress()) // Click "Accept" button

      await renderWithWrappers(
        <TestRenderer
          initialValues={{ ...baseProps.initialValues, push: false, email: false }}
          userAllowsEmails={false}
        />
      )

      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", true)
      await fireEvent.press(screen.getByTestId("save-alert-button"))

      await flushPromiseQueue()

      const mutation = mockEnvironment.mock.getMostRecentOperation()

      expect(mutation.request.node.operation.name).toEqual("updateNotificationPreferencesMutation")
      expect(mutation.request.variables).toEqual({
        input: { subscriptionGroups: [{ name: "custom_alerts", status: "SUBSCRIBED" }] },
      })
    })

    it("should not call update email frequency mutation if the user previously opted out of emails and toggle was on by default", async () => {
      await renderWithWrappers(
        <TestRenderer
          savedSearchAlertId="savedSearchAlertId"
          initialValues={{ ...baseProps.initialValues, email: true }}
          userAllowsEmails={false}
        />
      )

      await fireEvent.changeText(screen.getByTestId("alert-input-details"), "update details")
      await fireEvent.press(screen.getByTestId("save-alert-button"))

      await flushPromiseQueue()

      const mutation = mockEnvironment.mock.getMostRecentOperation()
      expect(mutation.request.node.operation.name).toEqual("updateSavedSearchAlertMutation")
    })
  })

  describe("Pills", () => {
    it("should correctly render pills", async () => {
      await renderWithWrappers(<TestRenderer />)

      expect(screen.getByText("artistName")).toBeTruthy()
      expect(screen.getByText("Limited Edition")).toBeTruthy()
      expect(screen.getByText("Tate Ward Auctions")).toBeTruthy()
      expect(screen.getByText("New York, NY, USA")).toBeTruthy()
      expect(screen.getByText("Photography")).toBeTruthy()
      expect(screen.getByText("Prints")).toBeTruthy()
    })

    it("should have removable filter pills", async () => {
      ;(useSavedSearchPills as jest.Mock)
        .mockImplementationOnce(() => pills)
        .mockImplementationOnce(() => pills)
        .mockImplementationOnce(() => pills)
        .mockImplementationOnce(() =>
          pills.filter((pill) => pill.label !== "Prints" && pill.label !== "Photography")
        )

      await renderWithWrappers(<TestRenderer />)
      // artist pill should appear and not be removable
      expect(screen.getByText("artistName")).toBeTruthy()
      expect(screen.getByText("artistName")).not.toHaveProp("onPress")

      await fireEvent.press(screen.getByText("Prints"))
      await fireEvent.press(screen.getByText("Photography"))

      expect(screen.queryByText("Prints")).not.toBeOnTheScreen()
      expect(screen.queryByText("Photography")).not.toBeOnTheScreen()
    })
  })

  describe("Create alert button", () => {
    describe("Create flow", () => {
      it("should be enabled by default", async () => {
        await renderWithWrappers(<TestRenderer />)

        expect(screen.getByTestId("save-alert-button")).not.toBeDisabled()
      })

      it("should be enabled if selected at least one of toggles", async () => {
        await renderWithWrappers(
          <TestRenderer
            initialValues={{ ...baseProps.initialValues, name: "name", push: false, email: false }}
          />
        )

        await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", true)

        expect(screen.getByTestId("save-alert-button")).not.toBeDisabled()
      })
    })

    describe("Update flow", () => {
      it("should be disabled by default", async () => {
        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        expect(screen.getByTestId("save-alert-button")).toBeDisabled()
      })

      it("should be disabled if no changes have been made by the user", async () => {
        await renderWithWrappers(
          <TestRenderer
            savedSearchAlertId="savedSearchAlertId"
            initialValues={{ ...baseProps.initialValues, name: "name" }}
          />
        )

        expect(screen.getByTestId("save-alert-button")).toBeDisabled()
      })

      it("should be enabled if changes have been made by the user", async () => {
        await renderWithWrappers(
          <TestRenderer
            savedSearchAlertId="savedSearchAlertId"
            initialValues={{ ...baseProps.initialValues, name: "name" }}
          />
        )

        await fireEvent.changeText(screen.getByTestId("alert-input-details"), "update details")

        expect(screen.getByTestId("save-alert-button")).not.toBeDisabled()
      })

      it("should be enabled if filters are changed", async () => {
        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        expect(screen.getByTestId("save-alert-button")).toBeDisabled()
        await fireEvent.press(screen.getByText("Limited Edition"))
        expect(screen.getByTestId("save-alert-button")).not.toBeDisabled()
      })

      it("should be enabled if selected at least one of toggles", async () => {
        await renderWithWrappers(
          <TestRenderer
            savedSearchAlertId="savedSearchAlertId"
            initialValues={{ ...baseProps.initialValues, name: "name", push: false, email: false }}
          />
        )

        await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", true)

        expect(screen.getByTestId("save-alert-button")).not.toBeDisabled()
      })
    })
  })

  describe("Email preferences", () => {
    it("should display email `Update email preferences` link only when email toggle is enabled", async () => {
      await renderWithWrappers(<TestRenderer />)

      expect(screen.getByText("Update email preferences")).toBeTruthy()

      await fireEvent(screen.getByLabelText("Email Toggler"), "valueChange", false)

      await flushPromiseQueue()

      expect(screen.queryByText("Update email preferences")).toBeFalsy()
    })

    it("should call navigate handler when `Update email preferences` link is pressed", async () => {
      await renderWithWrappers(<TestRenderer />)

      await fireEvent.press(screen.getByText("Update email preferences"))

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
      await renderWithWrappers(
        <TestRenderer onUpdateEmailPreferencesPress={onUpdateEmailPreferencesMock} />
      )

      await fireEvent.press(screen.getByText("Update email preferences"))

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
        await renderWithWrappers(<TestRenderer />)

        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await withoutDuplicateAlert()
        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()
          expect(mutation.fragment.node.name).toBe("createSavedSearchAlertMutation")
        })
      })

      it("should display a warning message if there is a duplicate", async () => {
        await renderWithWrappers(<TestRenderer />)

        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()
          expect(mutation.fragment.node.name).toBe("getAlertByCriteriaQuery")
        })

        await resolveMostRecentRelayOperation(mockEnvironment)

        await waitFor(() => expect(spyAlert.mock.calls[0][0]).toBe("Duplicate Alert"))
      })

      it('should call create mutation when "Replace" button is pressed', async () => {
        // @ts-ignore
        spyAlert.mockImplementation((_title, _message, buttons) => buttons[0].onPress()) // Click "Replace" button

        await renderWithWrappers(<TestRenderer />)

        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()
          expect(mutation.fragment.node.name).toBe("getAlertByCriteriaQuery")
        })

        await resolveMostRecentRelayOperation(mockEnvironment)

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()
          expect(mutation.fragment.node.name).toBe("createSavedSearchAlertMutation")
        })
      })
    })

    describe("Update flow", () => {
      it("should call update mutation without a warning message", async () => {
        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        await fireEvent.press(screen.getByText("Prints"))
        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()
          expect(mutation.fragment.node.name).toBe("getAlertByCriteriaQuery")
        })

        // No duplicate alert
        await resolveMostRecentRelayOperation(mockEnvironment, {
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

        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        await fireEvent.press(screen.getByText("Prints"))
        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()
          expect(mutation.fragment.node.name).toBe("getAlertByCriteriaQuery")
        })

        await resolveMostRecentRelayOperation(mockEnvironment)

        await waitFor(() => expect(spyAlert.mock.calls[0][0]).toBe("Duplicate Alert"))

        expect(navigate).toBeCalledWith("/favorites/alerts/internalID-1/edit")
      })

      it('should call update mutation when "Replace" button is pressed', async () => {
        // @ts-ignore
        spyAlert.mockImplementation((_title, _message, buttons) => buttons[0].onPress()) // Click "Replace" button

        await renderWithWrappers(<TestRenderer savedSearchAlertId="savedSearchAlertId" />)

        await fireEvent.press(screen.getByText("Prints"))
        await fireEvent.press(screen.getByTestId("save-alert-button"))

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()
          expect(mutation.fragment.node.name).toBe("getAlertByCriteriaQuery")
        })

        await resolveMostRecentRelayOperation(mockEnvironment)

        await waitFor(() => {
          const mutation = mockEnvironment.mock.getMostRecentOperation()
          expect(mutation.fragment.node.name).toBe("updateSavedSearchAlertMutation")
        })
      })
    })
  })
})

const savedSearchEntity: SavedSearchEntity = {
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

const pills = [
  { label: "artistName", paramName: "artistIDs", value: "artist-name" },
  { label: "Prints", paramName: "additionalGeneIDs", value: "prints" },
  { label: "Photography", paramName: "additionalGeneIDs", value: "prints" },
  { label: "Limited Edition", paramName: "attributionClass", value: "limited-edition" },
  { label: "Tate Ward Auctions", paramName: "partnerIDs", value: "tate-ward-auctions" },
  { label: "New York, NY, USA", paramName: "locationCities", value: "new-york-ny-usa" },
]
