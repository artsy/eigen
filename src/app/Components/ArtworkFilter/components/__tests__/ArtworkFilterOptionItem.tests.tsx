import { Checkbox } from "@artsy/palette-mobile"
import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkFilterOptionItem,
  ArtworkFilterOptionItemProps,
} from "app/Components/ArtworkFilter/components/ArtworkFilterOptionItem"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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

    expect(getByText("Rarity • 3")).toBeTruthy()
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
