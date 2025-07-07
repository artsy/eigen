import { useColor, useSpace } from "@artsy/palette-mobile"
import { renderHook } from "@testing-library/react-hooks"
import { useBottomTabsBadges } from "app/Navigation/utils/useBottomTabsBadges"
import { useVisualClue } from "app/utils/hooks/useVisualClue"
import { useTabBarBadge } from "app/utils/useTabBarBadge"

// Mocking the necessary imports
jest.mock("@artsy/palette-mobile", () => ({
  useColor: jest.fn(),
  useSpace: jest.fn(),
}))
jest.mock("app/utils/hooks/useVisualClue", () => ({
  useVisualClue: jest.fn(),
}))
jest.mock("app/utils/useTabBarBadge", () => ({
  useTabBarBadge: jest.fn(),
}))
jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: (flag: string) => flag === "AREnableBlueActivityDots",
}))

// Settings for the test
describe("useBottomTabsBadges", () => {
  const mockUseColor = useColor as jest.Mock
  const mockUseSpace = useSpace as jest.Mock
  const mockUseVisualClue = useVisualClue as jest.Mock
  const mockUseTabBarBadge = useTabBarBadge as jest.Mock

  beforeEach(() => {
    mockUseColor.mockReturnValue((color: string) => color)
    mockUseSpace.mockReturnValue(() => 10)
  })

  it("returns default badge states when no clues or notifications are present", () => {
    mockUseVisualClue.mockReturnValue({ showVisualClue: () => false })
    mockUseTabBarBadge.mockReturnValue({
      unreadConversationsCount: 0,
      hasUnseenNotifications: false,
    })

    const { result } = renderHook(() => useBottomTabsBadges())

    expect(result.current.tabsBadges).toMatchObject({
      home: { tabBarBadge: undefined, tabBarBadgeStyle: {} },
      search: { tabBarBadge: undefined, tabBarBadgeStyle: {} },
      inbox: { tabBarBadge: undefined, tabBarBadgeStyle: {} },
      profile: { tabBarBadge: undefined, tabBarBadgeStyle: {} },
    })
  })

  it('updates badge for "home" tab when unseen notifications are present', () => {
    mockUseVisualClue.mockReturnValue({ showVisualClue: () => false })
    mockUseTabBarBadge.mockReturnValue({
      hasUnseenNotifications: true,
    })

    const { result } = renderHook(() => useBottomTabsBadges())

    expect(result.current.tabsBadges.home).toMatchObject({
      tabBarBadge: "",
      tabBarBadgeStyle: {
        // Whatever style we have here
      },
    })
  })

  it('updates badge for "inbox" tab when unseen notifications are present', () => {
    mockUseVisualClue.mockReturnValue({ showVisualClue: () => false })
    mockUseTabBarBadge.mockReturnValue({
      unreadConversationsCount: 5,
    })

    const { result } = renderHook(() => useBottomTabsBadges())

    expect(result.current.tabsBadges.inbox).toMatchObject({
      tabBarBadge: 5,
      tabBarBadgeStyle: {
        // Whatever style we have here
      },
    })
  })

  it('prioritises conversations count over visual clues for "inbox" tab', () => {
    mockUseVisualClue.mockReturnValue({ showVisualClue: () => true })
    mockUseTabBarBadge.mockReturnValue({
      unreadConversationsCount: 5,
    })

    const { result } = renderHook(() => useBottomTabsBadges())

    expect(result.current.tabsBadges.inbox).toMatchObject({
      tabBarBadge: 5,
      tabBarBadgeStyle: {
        // Whatever style we have here
      },
    })
  })
})
