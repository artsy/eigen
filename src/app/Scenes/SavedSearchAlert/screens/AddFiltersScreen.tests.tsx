import { fireEvent } from "@testing-library/react-native"
import { ClearAllButton } from "app/Scenes/SavedSearchAlert/screens/AddFiltersScreen"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Alert } from "react-native"

jest.spyOn(Alert, "alert")

describe("ClearAllButton", () => {
  it("Shows an alert when pressed", async () => {
    const { getByText } = renderWithWrappers(<ClearAllButton />)

    fireEvent(getByText("Clear All"), "onPress")

    await flushPromiseQueue()

    expect(Alert.alert).toHaveBeenCalled()
  })

  // TODO: Implement feature and test
  it("Is disabled when there are no filters", () => {})
})
