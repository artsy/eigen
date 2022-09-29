import { HomeHeaderTestsQuery } from "__generated__/HomeHeaderTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { HomeHeaderFragmentContainer } from "./HomeHeader"

jest.unmock("react-relay")

describe("HomeHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer: React.FC = () => {
    const queryData = useLazyLoadQuery<HomeHeaderTestsQuery>(
      graphql`
        query HomeHeaderTestsQuery @raw_response_type {
          me {
            ...HomeHeader_me
          }
        }
      `,
      {}
    )

    return <HomeHeaderFragmentContainer me={queryData.me} />
  }

  describe("Activity", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableActivity: true,
      })
    })

    it("should NOT render unread indicator when there are no unread notifications", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          unreadNotificationsCount: 0,
        }),
      })
      await flushPromiseQueue()

      const indicator = queryByLabelText("Unread Activities Indicator")
      expect(indicator).toBeNull()
    })

    it("should render unread indicator when there are unread notifications", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          unreadNotificationsCount: 5,
        }),
      })
      await flushPromiseQueue()

      const indicator = getByLabelText("Unread Activities Indicator")
      expect(indicator).toBeTruthy()
    })
  })
})
