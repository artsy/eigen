import { fireEvent, waitFor } from "@testing-library/react-native"
import * as savedSearchButton from "lib/Components/Artist/ArtistArtworks/SavedSearchButton"
import { goBack, navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { mockFetchNotificationPermissions } from "lib/tests/mockFetchNotificationPermissions"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { PushAuthorizationStatus } from "lib/utils/PushNotification"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { EditSavedSearchAlertQueryRenderer } from "./EditSavedSearchAlert"

jest.unmock("react-relay")

const emitSavedSearchRefetchEventSpy = jest.spyOn(savedSearchButton, "emitSavedSearchRefetchEvent")

describe("EditSavedSearchAlert", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment.mockClear()
    notificationPermissions.mockImplementationOnce((cb) => cb(null, PushAuthorizationStatus.Authorized))
  })

  const TestRenderer = () => {
    return <EditSavedSearchAlertQueryRenderer savedSearchAlertId="savedSearchAlertId" />
  }

  it("renders without throwing an error", () => {
    const { getAllByTestId, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
    })
    mockEnvironmentPayload(mockEnvironment, {
      FilterArtworksConnection: () => filterArtworks,
    })

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual(["Lithograph", "Paper"])
    expect(getByTestId("alert-input-name").props.value).toBe("unique-name")
  })

  it("should navigate go back if the update mutation is successful", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
    })
    mockEnvironmentPayload(mockEnvironment, {
      FilterArtworksConnection: () => filterArtworks,
    })

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      mockEnvironmentPayload(mockEnvironment, {
        SearchCriteria: () => ({
          userAlertSettings: {
            name: "updated-name",
          },
        }),
      })
    })

    expect(goBack).toHaveBeenCalled()
    expect(emitSavedSearchRefetchEventSpy).toHaveBeenCalled()
  })

  it("should navigate to artworks grid when the view artworks is pressed", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
    })
    mockEnvironmentPayload(mockEnvironment, {
      Artist: () => ({
        internalID: "artistID",
      }),
      FilterArtworksConnection: () => filterArtworks,
    })

    fireEvent.press(getByTestId("view-artworks-button"))

    expect(navigate).toBeCalledWith("artist/artistID", {
      passProps: {
        searchCriteriaID: "savedSearchAlertId",
      },
    })
  })

  describe("When AREnableSavedSearchToggles is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchToggles: true })
    })

    it("should render two toggles are enabled", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment, {
        SearchCriteria: () => searchCriteria,
      })
      mockEnvironmentPayload(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
      })

      expect(getAllByA11yState({ selected: true })).toHaveLength(2)
    })

    it("should render two toggles are disabled", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            email: false,
            push: false,
          },
        }),
      })
      mockEnvironmentPayload(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
      })

      expect(getAllByA11yState({ selected: false })).toHaveLength(2)
    })

    it("should render push toggle is enabled, email toggle is disabled", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            push: false,
          },
        }),
      })
      mockEnvironmentPayload(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
      })

      expect(getAllByA11yState({ selected: false })).toHaveLength(1)
    })

    it("should render email toggle is enabled, push toggle is disabled", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            email: false,
          },
        }),
      })
      mockEnvironmentPayload(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
      })

      expect(getAllByA11yState({ selected: false })).toHaveLength(1)
    })
  })
})

const searchCriteria = {
  acquireable: null,
  additionalGeneIDs: [],
  artistID: "artistID",
  atAuction: null,
  attributionClass: [],
  colors: [],
  dimensionRange: null,
  height: null,
  inquireableOnly: null,
  locationCities: [],
  majorPeriods: [],
  materialsTerms: ["lithograph", "paper"],
  offerable: null,
  partnerIDs: [],
  priceRange: null,
  width: null,
  userAlertSettings: {
    name: "unique-name",
    push: true,
    email: true,
  },
}

const filterArtworks = {
  aggregations: [
    {
      slice: "MATERIALS_TERMS",
      counts: [
        {
          count: 641,
          name: "Lithograph",
          value: "lithograph",
        },
        {
          count: 411,
          name: "Paper",
          value: "paper",
        },
      ],
    },
  ],
}
