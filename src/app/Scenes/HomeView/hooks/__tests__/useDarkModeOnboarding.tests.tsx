import { useDarkModeOnboardingTestsQuery } from "__generated__/useDarkModeOnboardingTestsQuery.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { HomeViewScreen } from "app/Scenes/HomeView/HomeView"
import { __globalStoreTestUtils__, getCurrentEmissionState } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/utils/hooks/useIsDeepLink", () => {
  return {
    useIsDeepLink: jest.fn().mockReturnValue({ isDeepLink: false }),
  }
})
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: jest.fn(),
}))
jest.mock("app/store/GlobalStore", () => ({
  ...jest.requireActual("app/store/GlobalStore"),
  getCurrentEmissionState: jest.fn(),
}))
const useToastMock = useToast as jest.Mock
const mockShowToast = jest.fn()
const mockGetCurrentEmissionState = getCurrentEmissionState as jest.Mock

describe("useDarkModeOnboarding on HomeView", () => {
  const { renderWithRelay } = setupTestWrapper<useDarkModeOnboardingTestsQuery>({
    Component: () => {
      return <HomeViewScreen />
    },
    query: graphql`
      query useDarkModeOnboardingTestsQuery($count: Int!, $cursor: String) @relay_test_operation {
        viewer {
          ...HomeViewSectionsConnection_viewer @arguments(count: $count, cursor: $cursor)
        }
        homeView {
          experiments {
            name
            variant
            enabled
          }
        }
      }
    `,
  })

  beforeEach(() => {
    useToastMock.mockReturnValue({ show: mockShowToast })
    mockGetCurrentEmissionState.mockReturnValue(() => ({
      launchCount: 2,
    }))

    __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeSupport: true })
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeOnboarding: true })
  })

  afterEach(() => {
    mockShowToast.mockClear()
  })

  it("shows toast with dark mode notification", () => {
    renderWithRelay()

    expect(mockShowToast).toHaveBeenCalledWith(
      "Dark Mode is here!",
      "bottom",
      expect.objectContaining({
        description: "You can now toggle Dark Mode in Settings.",
        duration: "long",
      })
    )
  })

  it("does not show toast if dark mode is not enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeSupport: false })

    renderWithRelay()

    expect(mockShowToast).not.toHaveBeenCalled()
  })

  it("does not show toast if dark mode onboarding is not enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeOnboarding: false })

    renderWithRelay()

    expect(mockShowToast).not.toHaveBeenCalled()
  })
})
