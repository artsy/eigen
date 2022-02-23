import { FairEmptyStateFragmentContainer } from "app/Scenes/Fair/Components/FairEmptyState"
import { extractText } from "app/tests/extractText"
import { setupTestWrapper } from "app/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"

jest.unmock("react-relay")

const { getWrapper } = setupTestWrapper({
  Component: FairEmptyStateFragmentContainer,
  query: graphql`
    query FairEmptyStateTestsQuery {
      fair(id: "example-fair-id") {
        ...FairEmptyState_fair
      }
    }
  `,
})

describe("FairEmptyState", () => {
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
      const wrapper = getWrapper({
        Fair: () => ({ isActive: false, endAt: DateTime.local().plus({ days: 1 }) }),
      })
      expect(extractText(wrapper.root)).toEqual(
        "This fair is currently unavailable. Please check back closer to the fair for artworks."
      )
    })
  })
})
