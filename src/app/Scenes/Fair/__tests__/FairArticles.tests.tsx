import { FAIR2_ARTICLES_QUERY, FairArticlesPaginationContainer } from "app/Scenes/Fair/FairArticles"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper_LEGACY } from "app/utils/tests/setupTestWrapper"

const { getWrapper } = setupTestWrapper_LEGACY({
  Component: FairArticlesPaginationContainer,
  query: FAIR2_ARTICLES_QUERY,
})

describe("FairArticles", () => {
  it("renders an empty message if there are no articles", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        articlesConnection: {
          totalCount: 0,
          edges: [],
        },
      }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("There aren’t any articles at this time.")
  })

  it("renders articles", () => {
    const wrapper = getWrapper({
      Article: () => ({ title: "Example Article" }),
      Author: () => ({ name: "Example Author" }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Example Article")
    expect(text).toContain("Example Author")
  })
})
