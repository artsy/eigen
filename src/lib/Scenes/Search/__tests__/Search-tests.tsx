import { Theme } from "@artsy/palette"
import React from "react"
import { TextInput } from "react-native"
import ReactTestRenderer, { act } from "react-test-renderer"
import { CatchErrors } from "../../../utils/CatchErrors"
import { AutosuggestResults } from "../AutosuggestResults"
import { RecentSearches } from "../RecentSearches"
import { Search } from "../Search"

jest.mock("../AutosuggestResults", () => ({ AutosuggestResults: () => null }))

const TestWrapper: typeof Search = props => (
  <Theme>
    <CatchErrors>
      <Search {...props} />
    </CatchErrors>
  </Theme>
)

describe("The Search page", () => {
  it(`passes the query to the AutosuggestResults when the query is nonempty`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper />)

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText("michael")
    })

    expect(tree.root.findAllByType(RecentSearches)).toHaveLength(0)
    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(1)
    expect(tree.root.findByType(AutosuggestResults).props.query).toBe("michael")
  })
})
