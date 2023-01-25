import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"
import { ActivityMarkAllAsReadSection } from "./ActivityMarkAllAsReadSection"


describe("ActivityMarkAllAsReadSection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("correctly display state when there are NO notifications", () => {
    const { getByText } = renderWithHookWrappersTL(
      <ActivityMarkAllAsReadSection hasUnreadNotifications={false} />,
      mockEnvironment
    )

    expect(getByText("No new notifications")).toBeDefined()
    expect(getByText("Mark all as read")).toBeDisabled()
  })

  it("correctly display state when there are notifications", () => {
    const { getByText } = renderWithHookWrappersTL(
      <ActivityMarkAllAsReadSection hasUnreadNotifications />,
      mockEnvironment
    )

    expect(getByText("New notifications")).toBeDefined()
    expect(getByText("Mark all as read")).not.toBeDisabled()
  })
})
