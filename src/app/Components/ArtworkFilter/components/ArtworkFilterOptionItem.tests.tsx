import { fireEvent, within } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Checkbox } from "palette"
import { ArtworkFilterOptionItem, ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

const defaultProps: ArtworkFilterOptionItemProps = {
  item: {
    filterType: "attributionClass",
    displayText: "Rarity",
    ScreenComponent: "AttributionClassOptionsScreen",
  },
  count: 0,
  onPress: jest.fn,
}

describe("ArtworkFilterOptionItem", () => {
  const TestWrapper = (props?: Partial<ArtworkFilterOptionItemProps>) => {
    return <ArtworkFilterOptionItem {...defaultProps} {...props} />
  }

  it("should render item label", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    expect(getByText("Rarity"))
  })

  it("should render count label if it is passed", () => {
    const { getByText } = renderWithWrappers(<TestWrapper count={3} />)

    expect(within(getByText("Rarity")).getByText("• 3")).toBeTruthy()
  })

  it('should call "onPress" handler when item is pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = renderWithWrappers(<TestWrapper onPress={onPressMock} />)

    fireEvent.press(getByText("Rarity"))

    expect(onPressMock).toBeCalled()
  })

  it("renders the right accessory item if passed as props instead of arrow icon", () => {
    const RightAccessoryItem = () => <Checkbox checked testID="checktestid" />
    const treeWithAccessory = renderWithWrappers(
      <TestWrapper RightAccessoryItem={<RightAccessoryItem />} />
    )

    const treeWithoutAccessory = renderWithWrappers(<TestWrapper />)

    expect(treeWithAccessory.queryByTestId("checktestid")).toBeDefined()
    expect(treeWithAccessory.queryByTestId("ArtworkFilterOptionItemArrowIcon")).toBe(null)

    expect(treeWithoutAccessory.queryByTestId("ArtworkFilterOptionItemArrowIcon")).toBeDefined()
  })
})
