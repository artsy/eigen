import { CreateSavedSearchAlertTestsQuery } from "__generated__/CreateSavedSearchAlertTestsQuery.graphql"
import { FilterData, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
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

const filters: FilterData[] = [
  {
    displayText: "Bid",
    paramName: FilterParamName.waysToBuyBid,
    paramValue: true,
  },
]

const initialData: ArtworkFiltersState = {
  selectedFilters: [],
  appliedFilters: filters,
  previouslyAppliedFilters: filters,
  applyFilters: false,
  aggregations: [],
  filterType: "artwork",
  counts: {
    total: null,
    followedArtists: null,
  },
}

const defaultParams: CreateSavedSearchAlertParams = {
  filters,
  aggregations: [],
  artistIds: ["artistID"],
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
              ...CreateSavedSearchContentContainerV1_me
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

  const renderAndExecuteQuery = (
    props?: Partial<CreateSavedSearchAlertProps>,
    mockResolvers?: MockResolvers
  ) => {
    const render = renderWithWrappersTL(<TestRenderer {...props} />)

    // CreateSavedSearchAlertTestsQuery
    mockEnvironmentPayload(mockEnvironment, mockResolvers)

    return render
  }

  it("renders without throwing an error", () => {
    const { getByText } = renderAndExecuteQuery({})

    expect(getByText("Bid")).toBeTruthy()
  })

  it('"Email alerts" toggle is disabled by default if a user has not allowed email notifications', async () => {
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

describe("CreateSavedSearchAlertV2", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment.mockClear()
    notificationPermissions.mockClear()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
  })

  const TestRenderer = (params: Partial<CreateSavedSearchAlertParams>) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <CreateSavedSearchAlert visible params={{ ...defaultParams, ...params }} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders without throwing an error", async () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment)

    expect(getByText("Bid")).toBeTruthy()
  })

  it('"Email alerts" toggle is disabled by default if a user has not allowed email notifications', async () => {
    notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))

    const { findAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        emailFrequency: "none",
      }),
    })

    const toggles = await findAllByA11yState({ selected: false })

    expect(toggles).toHaveLength(1)
  })

  it('"Save Alert" should be enabled by default', async () => {
    const { getAllByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        emailFrequency: "none",
      }),
    })

    expect(getAllByText("Save Alert")[0]).toBeEnabled()
  })
})
