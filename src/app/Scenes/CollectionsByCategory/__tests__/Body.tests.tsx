import { screen } from "@testing-library/react-native"
import { BodyHomeViewSectionCardsTestQuery } from "__generated__/BodyHomeViewSectionCardsTestQuery.graphql"
import { Body } from "app/Scenes/CollectionsByCategory/Body"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: { category: "mock-category" },
  }),
}))

jest.mock("app/Scenes/CollectionsByCategory/CollectionRail", () => ({
  CollectionRailWithSuspense: () => null,
  CollectionRailPlaceholder: () => null,
}))

describe("Body", () => {
  const { renderWithRelay } = setupTestWrapper<BodyHomeViewSectionCardsTestQuery>({
    Component: ({ viewer }) => <Body viewer={viewer} />,
    query: graphql`
      query BodyHomeViewSectionCardsTestQuery {
        viewer @required(action: NONE) {
          ...BodyCollectionsByCategory_viewer
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/Explore collections by mock-category/)).toBeOnTheScreen()
    expect(screen.getByText(/<mock-value-for-field-"title">/)).toBeOnTheScreen()
  })
})
