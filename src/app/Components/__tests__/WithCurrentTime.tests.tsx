import { screen } from "@testing-library/react-native"
import { WithCurrentTime } from "app/Components/WithCurrentTime"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("WithCurrentTime", () => {
  it("renders correctly", () => {
    renderWithWrappers(
      <WithCurrentTime>
        {(currentTime) => <Text testID="current-time">Time: {currentTime}</Text>}
      </WithCurrentTime>
    )

    // Just check that it renders something with our test ID
    expect(screen.getByTestId("current-time")).toBeTruthy()
  })
})
