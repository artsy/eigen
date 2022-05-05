import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import { graphql } from "relay-runtime"
import { QuestionsFragmentContainer } from "./Questions"

jest.unmock("react-relay")

xdescribe("Questions", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: ({ artwork }: any) => (
      <Theme>
        <QuestionsFragmentContainer artwork={artwork} />
      </Theme>
    ),
    query: graphql`
      query Questions_Test_Query {
        artwork(id: "test-id") {
          ...Questions_artwork
        }
      }
    `,
  })

  it("renders", () => {
    const { getByText, getAllByText } = renderWithRelay({
      Artwork: () => ({}),
    })

    expect(getByText("Questions about this piece?")).toBeDefined()
    expect(getAllByText("Contact Gallery")).toHaveLength(2)
  })
})
