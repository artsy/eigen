import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { CreateSavedSearchAlertTestsQuery } from "__generated__/CreateSavedSearchAlertTestsQuery.graphql"
import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { mockFetchNotificationPermissions } from "lib/tests/mockFetchNotificationPermissions"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { PushAuthorizationStatus } from "lib/utils/PushNotification"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { CreateSavedSearchAlertParams, CreateSavedSearchAlertProps } from "../SavedSearchAlertModel"
import { CreateSavedSearchContent, CreateSavedSearchContentProps } from "./CreateSavedSearchContent"

jest.unmock("react-relay")

const navigationMock = {
  navigate: jest.fn(),
}

const relayMock = {
  refetch: jest.fn(),
  push: jest.fn(),
}

const defaultProps: CreateSavedSearchContentProps = {
  navigation: navigationMock as any,
  relay: relayMock as any,
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
}

const Stack = createStackNavigator()

const MockedNavigator = ({ component, params = {} }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MockedScreen" component={component} initialParams={params} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

describe("CreateSavedSearchAlert", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment.mockClear()
    notificationPermissions.mockClear()
  })

  const TestRenderer = (props: Partial<CreateSavedSearchContentProps>) => {
    return <CreateSavedSearchContent {...defaultProps} {...props} />
  }

  it("renders without throwing an error", () => {
    const { getAllByTestId } = renderWithWrappersTL(<TestRenderer />)

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual(["Bid"])
  })
})
