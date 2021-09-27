import { MyProfileTestsQuery } from "__generated__/MyProfileTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Platform } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionAndSavedWorks } from "../MyCollectionAndSavedWorks"
import { MyProfile, MyProfileContainer } from "../MyProfile"

jest.mock("../LoggedInUserInfo")
jest.unmock("react-relay")

describe(MyProfile, () => {
  // Tests with MyCollections enabled are in MyProfileSettings-tests

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyProfileTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyProfileTestsQuery {
          me {
            ...MyProfile_me
          }
        }
      `}
      render={({ props }) => {
        if (props?.me) {
          return <MyProfileContainer me={props.me} />
        }
      }}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }
  it("renders without throwing an error", () => {
    getWrapper()
  })

  describe("When MyCollection is enabled", () => {
    it("Loads MyCollectionAndSavedArtworks Screen", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionIOS: true })
      Platform.OS = "ios"
      const tree = getWrapper()
      expect(tree.root.findByType(MyCollectionAndSavedWorks)).toBeDefined()
      // It does not display OldMyProfile
      expect(tree.root.findAllByProps({ testID: "my-old-profile-scrollview" })).toHaveLength(0)
    })
  })

  describe("When MyCollection is NOT enabled: Using Old Profile", () => {
    it("renders push notifications on iOS", () => {
      Platform.OS = "ios"
      const tree = getWrapper()
      expect(extractText(tree.root)).toContain("Push notifications")
    })

    it("renders push notifications on Android", () => {
      Platform.OS = "android"
      const tree = getWrapper()
      expect(extractText(tree.root)).toContain("Push notifications")
    })

    it("renders Saved Alerts only when the AREnableSavedSearchV2 flag is enable", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchV2: true })

      const tree = getWrapper()
      expect(extractText(tree.root)).toContain("Saved Alerts")
    })

    it("renders Orders when the AREnableOrderHistoryOption flag is enabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableOrderHistoryOption: true })

      const tree = getWrapper()
      expect(extractText(tree.root)).toContain("Order History")
    })

    it("renders Addresses when the AREnableSavedAddresses flag is enabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedAddresses: true })

      const tree = getWrapper()
      expect(extractText(tree.root)).toContain("Saved Addresses")
    })
  })
})
