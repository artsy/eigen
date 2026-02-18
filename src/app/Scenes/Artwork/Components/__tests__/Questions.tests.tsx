import { screen } from "@testing-library/react-native"
import { Questions_Test_Query } from "__generated__/Questions_Test_Query.graphql"
import { Questions } from "app/Scenes/Artwork/Components/Questions"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Questions", () => {
  const { renderWithRelay } = setupTestWrapper<Questions_Test_Query>({
    Component: (props) => {
      if (!props.artwork || !props.me) {
        return null
      }
      return <Questions artwork={props.artwork} me={props.me} />
    },
    query: graphql`
      query Questions_Test_Query @relay_test_operation {
        artwork(id: "test-id") {
          ...Questions_artwork
        }
        me {
          ...useSendInquiry_me
          ...MyProfileEditModal_me
        }
      }
    `,
  })

  it("renders", async () => {
    renderWithRelay({ Artwork: () => ({}), Me: () => ({}) })
    expect(screen.getByText("Questions about this piece?")).toBeDefined()
    expect(screen.getByText("Contact Gallery")).toBeDefined()
  })
})
