import { Fair2EmptyStateFragmentContainer } from "lib/Scenes/Fair2/Components/Fair2EmptyState"
import { extractText } from "lib/tests/extractText"
import { setupTestWrapper } from "lib/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"

jest.unmock("react-relay")

const { getWrapper } = setupTestWrapper({
  Component: Fair2EmptyStateFragmentContainer,
  query: graphql`
    query Fair2EmptyStateTestsQuery {
      fair(id: "example-fair-id") {
        ...Fair2EmptyState_fair
      }
    }
  `,
})

describe("Fair2EmptyState", () => {
  it("renders null when the fair is active", () => {
    const wrapper = getWrapper({ Fair: () => ({ isActive: true }) })
    expect(wrapper.toJSON()).toBeNull()
  })

  describe("inactive", () => {
    it("renders correctly when the fair is inactive", () => {
      const wrapper = getWrapper({ Fair: () => ({ isActive: false }) })
      expect(extractText(wrapper.root)).toEqual("This fair is currently unavailable.")
    })

    it("renders correctly when the fair is in the future", () => {
      const wrapper = getWrapper({ Fair: () => ({ isActive: false, endAt: DateTime.local().plus({ days: 1 }) }) })
      expect(extractText(wrapper.root)).toEqual(
        "This fair is currently unavailable. Please check back closer to the fair for artworks."
      )
    })
  })
})
