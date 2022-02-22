import { FAIR2_ARTICLES_QUERY, FairArticlesPaginationContainer } from "app/Scenes/Fair/FairArticles"
import { extractText } from "app/tests/extractText"
import { setupTestWrapper } from "app/tests/setupTestWrapper"

jest.unmock("react-relay")

const { getWrapper } = setupTestWrapper({
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
