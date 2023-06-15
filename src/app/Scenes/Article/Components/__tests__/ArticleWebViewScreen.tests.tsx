import { screen } from "@testing-library/react-native"
import { ArticleWebViewScreen } from "app/Scenes/Article/Components/ArticleWebViewScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "relay-runtime"

describe("ArticleWebViewScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArticleWebViewScreen,
    query: graphql`
      query ArticleWebViewScreenTestQuery {
        article(id: "foo") {
          ...ArticleWebViewScreen_article
        }
      }
    `,
  })

  it("renders correctly", () => {
    renderWithRelay({
      Article: () => ({
        href: "/article/foo",
        title: "Example Article",
      }),
    })

    expect(screen.getByText("Example Article")).toBeOnTheScreen()
    expect(screen.UNSAFE_getByProps({ url: "/article/foo" })).toBeOnTheScreen()
  })
})
