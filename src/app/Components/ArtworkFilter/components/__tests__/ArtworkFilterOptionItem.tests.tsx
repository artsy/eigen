import { Checkbox } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
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

  it("should render item label", async () => {
    await renderWithWrappers(<TestWrapper />)

    expect(screen.getByText("Rarity"))
  })

  it("should render count label if it is passed", async () => {
    await renderWithWrappers(<TestWrapper count={3} />)

    expect(screen.getByText("Rarity • 3")).toBeTruthy()
  })

  it('should call "onPress" handler when item is pressed', async () => {
    const onPressMock = jest.fn()
    await renderWithWrappers(<TestWrapper onPress={onPressMock} />)

    await fireEvent.press(screen.getByText("Rarity"))

    expect(onPressMock).toBeCalled()
  })

  it("renders the right accessory item if passed as props instead of arrow icon", async () => {
    const RightAccessoryItem = () => <Checkbox checked testID="checktestid" />
    const view = await renderWithWrappers(
      <TestWrapper RightAccessoryItem={<RightAccessoryItem />} />
    )

    expect(screen.getByTestId("checktestid")).toBeOnTheScreen()
    expect(screen.queryByTestId("ArtworkFilterOptionItemArrowIcon")).not.toBeOnTheScreen()

    await view.unmount()
    await renderWithWrappers(<TestWrapper />)

    expect(screen.getByTestId("ArtworkFilterOptionItemArrowIcon")).toBeOnTheScreen()
  })
})
