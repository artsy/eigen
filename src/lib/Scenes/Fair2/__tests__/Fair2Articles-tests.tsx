import { FAIR2_ARTICLES_QUERY, Fair2ArticlesPaginationContainer } from "lib/Scenes/Fair2/Fair2Articles"
import { extractText } from "lib/tests/extractText"
import { setupTestWrapper } from "lib/tests/setupTestWrapper"

jest.unmock("react-relay")

const { getWrapper } = setupTestWrapper({
  Component: Fair2ArticlesPaginationContainer,
  query: FAIR2_ARTICLES_QUERY,
})

describe("Fair2Articles", () => {
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
