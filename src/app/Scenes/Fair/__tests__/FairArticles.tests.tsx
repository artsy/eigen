import { screen } from "@testing-library/react-native"
import { FairArticlesQuery } from "__generated__/FairArticlesQuery.graphql"
import { FAIR2_ARTICLES_QUERY, FairArticlesPaginationContainer } from "app/Scenes/Fair/FairArticles"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const { renderWithRelay } = setupTestWrapper<FairArticlesQuery>({
  Component: (props) => <FairArticlesPaginationContainer fair={props.fair!} />,
  query: FAIR2_ARTICLES_QUERY,
})

describe("FairArticles", () => {
  it("renders an empty message if there are no articles", async () => {
    await renderWithRelay({
      Fair: () => ({
        articlesConnection: {
          totalCount: 0,
          edges: [],
        },
      }),
    })

    expect(screen.getByText(/There aren’t any articles at this time./)).toBeOnTheScreen()
  })

  it("renders articles", async () => {
    await renderWithRelay({
      Article: () => ({ title: "Example Article" }),
      Author: () => ({ name: "Example Author" }),
    })

    expect(screen.getAllByText(/Example Article/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Example Author/).length).toBeGreaterThan(0)
  })
})
