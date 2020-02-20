import { Theme } from "@artsy/palette"
import { FakeNavigator as MockNavigator } from "lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "lib/Components/FilterModal"
import React from "react"
import * as renderer from "react-test-renderer"
import { SortOptionsScreen as SortOptions } from "../SortOptions"

describe("Sort Options Screen", () => {
  let mockNavigator: MockNavigator

  beforeEach(() => {
    mockNavigator = new MockNavigator()
  })

  it("renders the correct number of sort options", () => {
    const root = renderer.create(
      <Theme>
        <SortOptions navigator={mockNavigator as any} />
      </Theme>
    ).root

    expect(root.findAllByType(OptionListItem)).toHaveLength(7)
  })
})
