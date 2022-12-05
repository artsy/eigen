import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"
import { HomeHeader } from "./HomeHeader"

jest.unmock("react-relay")

describe("HomeHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer: React.FC = () => {
    return <HomeHeader />
  }

  describe("Activity", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableActivity: true,
      })
    })

    it("should NOT render unread indicator when there are no unread notifications", async () => {
      __globalStoreTestUtils__?.injectState({
        bottomTabs: {
          sessionState: { unreadCounts: { unreadActivityPanelNotificationsCount: 0 } },
        },
      })

      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      const indicator = queryByLabelText("Unread Activities Indicator")
      expect(indicator).toBeNull()
    })

    it("should render unread indicator when there are unread notifications", async () => {
      __globalStoreTestUtils__?.injectState({
        bottomTabs: {
          sessionState: { unreadCounts: { unreadActivityPanelNotificationsCount: 1 } },
        },
      })

      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      const indicator = getByLabelText("Unread Activities Indicator")
      expect(indicator).toBeTruthy()
    })
  })
})
