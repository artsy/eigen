import { screen } from "@testing-library/react-native"
import { ArrowDetails } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArrowDetails"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { View } from "react-native"

jest.mock("@artsy/icons/native", () => {
  const { View } = jest.requireActual("react-native")
  return {
    ...jest.requireActual("@artsy/icons/native"),
    ChevronRightIcon: () => <View testID="chevron-right-icon" />,
  }
})

describe("ArrowDetails", () => {
  it("renders correct components", async () => {
    const Noop: React.FC = () => <View testID="noop-child" />
    await renderWithWrappers(
      <ArrowDetails>
        <Noop />
      </ArrowDetails>
    )
    expect(screen.getByTestId("noop-child")).toBeOnTheScreen()
    expect(screen.getByTestId("chevron-right-icon")).toBeOnTheScreen()
  })
})
