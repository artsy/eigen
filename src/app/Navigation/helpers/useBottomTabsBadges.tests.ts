import { useColor, useSpace } from "@artsy/palette-mobile"
import { renderHook } from "@testing-library/react-hooks"
import { useVisualClue } from "app/utils/hooks/useVisualClue"
import { useTabBarBadge } from "app/utils/useTabBarBadge"
import { useBottomTabsBadges } from "./useBottomTabsBadges"

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
      home: { badgeCount: undefined, badgeStyle: {} },
      search: { badgeCount: undefined, badgeStyle: {} },
      inbox: { badgeCount: undefined, badgeStyle: {} },
      sell: { badgeCount: undefined, badgeStyle: {} },
      profile: { badgeCount: undefined, badgeStyle: {} },
    })
  })

  it('updates badge for "home" tab when unseen notifications are present', () => {
    mockUseVisualClue.mockReturnValue({ showVisualClue: () => false })
    mockUseTabBarBadge.mockReturnValue({
      hasUnseenNotifications: true,
    })

    const { result } = renderHook(() => useBottomTabsBadges())

    expect(result.current.tabsBadges.home).toMatchObject({
      badgeCount: "",
      badgeStyle: {
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
      badgeCount: 5,
      badgeStyle: {
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
      badgeCount: 5,
      badgeStyle: {
        // Whatever style we have here
      },
    })
  })
})
