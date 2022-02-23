import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtworkFiltersStoreProvider } from "../ArtworkFilterStore"
import {
  ArtworkFilterOptionCheckboxItem,
  ArtworkFilterOptionCheckboxItemProps,
} from "./ArtworkFilterOptionCheckboxItem"

const defaultProps: ArtworkFilterOptionCheckboxItemProps = {
  item: {
    filterType: "showOnlySubmittedArtworks",
    displayText: "Show Only Submitted Artworks",
    ScreenComponent: "FilterOptionsScreen",
  },
  count: 0,
}

describe("ArtworkFilterOptionCheckboxItem", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
  })

  const TestWrapper = (props?: Partial<ArtworkFilterOptionCheckboxItemProps>) => {
    return (
      <ArtworkFiltersStoreProvider>
        <ArtworkFilterOptionCheckboxItem {...defaultProps} {...props} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders properly", () => {
    const { queryByTestId } = renderWithWrappersTL(<TestWrapper />)
    expect(queryByTestId("ArtworkFilterOptionItemRow")).toBeDefined()
    expect(queryByTestId("ArtworkFilterOptionCheckboxItemCheckbox")).toBeDefined()
  })
})
