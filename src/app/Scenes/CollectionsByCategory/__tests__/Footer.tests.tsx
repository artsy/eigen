import { fireEvent, screen } from "@testing-library/react-native"
import { FooterHomeViewSectionCardsTestQuery } from "__generated__/FooterHomeViewSectionCardsTestQuery.graphql"
import { Footer } from "app/Scenes/CollectionsByCategory/Footer"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({
    params: {
      props: {
        category: "mock-category",
        homeViewSectionId: "test-id",
      },
    },
  }),
}))

describe("Footer", () => {
  const { renderWithRelay } = setupTestWrapper<FooterHomeViewSectionCardsTestQuery>({
    Component: ({ homeView }) => <Footer cards={homeView.section} homeViewSectionId="test-id" />,
    query: graphql`
      query FooterHomeViewSectionCardsTestQuery {
        homeView @required(action: NONE) {
          section(id: "test-id") @required(action: NONE) {
            ...Footer_homeViewSectionCards
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({ HomeViewCardConnection: () => cards })

    expect(screen.getByText(/mock-title-1/)).toBeOnTheScreen()
  })

  it("navigates", () => {
    renderWithRelay({ HomeViewCardConnection: () => cards })

    fireEvent.press(screen.getByText(/mock-title-1/))
    expect(navigate).toHaveBeenCalledWith(
      "/collections-by-category/mock-title-1?homeViewSectionId=test-id&entityID=mock-entity-id-1"
    )
  })
})

const cards = {
  edges: [
    { node: { title: "mock-title-1", entityID: "mock-entity-id-1" } },
    { node: { title: "mock-title-2", entityID: "mock-entity-id-2" } },
  ],
}
