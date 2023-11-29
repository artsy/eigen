import { screen } from "@testing-library/react-native"
import { ModalStack } from "app/system/navigation/ModalStack"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { BottomTabsNavigator } from "./BottomTabsNavigator"

describe(BottomTabsNavigator, () => {
  it("shows the current tab content", async () => {
    renderWithWrappers(
      <ModalStack>
        <BottomTabsNavigator />
      </ModalStack>
    )

    expect(screen.queryByLabelText("home bottom tab")).toBeOnTheScreen()
    expect(screen.queryByLabelText("search bottom tab")).toBeOnTheScreen()
    expect(screen.queryByLabelText("inbox bottom tab")).toBeOnTheScreen()
    expect(screen.queryByLabelText("sell bottom tab")).toBeOnTheScreen()
    expect(screen.queryByLabelText("profile bottom tab")).toBeOnTheScreen()

    expect(screen.getByAccessibilityState({ selected: true })).toHaveProp(
      "accessibilityLabel",
      "home bottom tab"
    )
  })
})
