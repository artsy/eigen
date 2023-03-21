import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { ArticlesScreen } from "./Articles"

describe("Articles", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ArticlesScreen />,
  })

  it("renders articles", async () => {
    renderWithRelay({
      Query: () => ({
        articlesConnection: mockArticlesConnection,
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("articles-screen-placeholder"))

    expect(screen.getByText("Sebastián Meltz-Collazo")).toBeTruthy()
    expect(
      screen.getByText("The Galleries Championing Artists from the Caribbean Region")
    ).toBeTruthy()
    expect(screen.getByText("5 Artists on Our Radar This June")).toBeTruthy()
  })
})

const mockArticlesConnection = {
  edges: [
    {
      node: {
        byline: "Sebastián Meltz-Collazo",
        thumbnailTitle: "The Galleries Championing Artists from the Caribbean Region",
      },
    },
    {
      node: {
        byline: "Artsy Editorial",
        thumbnailTitle: "5 Artists on Our Radar This June",
      },
    },
  ],
}
