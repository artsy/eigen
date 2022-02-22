import { fireEvent, within } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
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
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
  })

  const TestWrapper = (props?: Partial<ArtworkFilterOptionItemProps>) => {
    return <ArtworkFilterOptionItem {...defaultProps} {...props} />
  }

  it("should render item label", () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper />)

    expect(getByText("Rarity"))
  })

  it("should render count label if it is passed", () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper count={3} />)

    expect(within(getByText("Rarity")).getByText("• 3")).toBeTruthy()
  })

  it('should call "onPress" handler when item is pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = renderWithWrappersTL(<TestWrapper onPress={onPressMock} />)

    fireEvent.press(getByText("Rarity"))

    expect(onPressMock).toBeCalled()
  })
})
