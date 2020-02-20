import { Theme } from "@artsy/palette"
import { FakeNavigator as MockNavigator } from "lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import React from "react"
import * as renderer from "react-test-renderer"
import { SortOptionsScreen as SortOptions } from "../SortOptions"

describe("Sort Options Screen", () => {
  let mockNavigator: MockNavigator

  beforeEach(() => {
    mockNavigator = new MockNavigator()
  })

  it("renders properly", () => {
    const SortOptionsScreen = renderer.create(
      <Theme>
        <SortOptions navigator={mockNavigator as any} />
      </Theme>
    )
    expect(SortOptionsScreen).toMatchSnapshot()
  })
})
