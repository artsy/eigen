import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ArticlesScreen } from "app/Scenes/Articles/Articles"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("Articles", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ArticlesScreen />,
  })

  it("renders articles", async () => {
    renderWithRelay({
      Query: () => ({
        articlesConnection: {
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
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("articles-screen-placeholder"), {
      timeout: 15000,
    })

    expect(screen.getByText("Sebastián Meltz-Collazo")).toBeTruthy()
    expect(
      screen.getByText("The Galleries Championing Artists from the Caribbean Region")
    ).toBeTruthy()
    expect(screen.getByText("5 Artists on Our Radar This June")).toBeTruthy()
  })
})
