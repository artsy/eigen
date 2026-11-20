import { fireEvent, screen } from "@testing-library/react-native"
import { SectionTitle } from "app/Components/SectionTitle"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// render the right arrow icon as a host element so we can assert on its presence
jest.mock("@artsy/icons/native", () => {
  const { View } = require("react-native")
  return {
    ...jest.requireActual("@artsy/icons/native"),
    ChevronRightIcon: () => <View testID="chevron-right-icon" />,
  }
})

describe("SectionTitle", () => {
  it(`renders a title alone`, async () => {
    renderWithWrappers(<SectionTitle title="Hello" />)

    expect(screen.getByText(/Hello/)).toBeOnTheScreen()
    expect(screen.queryByTestId("chevron-right-icon")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("subtitle")).not.toBeOnTheScreen()
  })

  it(`renders a subtitle when specified`, async () => {
    renderWithWrappers(<SectionTitle title="Hello" subtitle="welcome to test" />)

    expect(screen.getByTestId("title")).toHaveTextContent(/Hello/)
    expect(screen.getByTestId("subtitle")).toHaveTextContent("welcome to test")
    expect(screen.queryByTestId("chevron-right-icon")).not.toBeOnTheScreen()
  })

  it(`renders a right arrow when given an 'onPress' prop`, async () => {
    const onPress = jest.fn()
    renderWithWrappers(<SectionTitle title="Hello" subtitle="welcome to test" onPress={onPress} />)

    expect(screen.getByTestId("title")).toHaveTextContent(/Hello/)
    expect(screen.getByTestId("subtitle")).toHaveTextContent("welcome to test")
    expect(screen.getAllByTestId("chevron-right-icon")).toHaveLength(1)
    fireEvent.press(screen.getByTestId("touchable-wrapper"))
    expect(onPress).toHaveBeenCalled()
  })
})
