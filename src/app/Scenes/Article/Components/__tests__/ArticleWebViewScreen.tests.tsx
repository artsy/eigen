import { screen } from "@testing-library/react-native"
import { ArticleWebViewScreen } from "app/Scenes/Article/Components/ArticleWebViewScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/Components/ArtsyWebView", () => {
  const { Text } = require("react-native")
  return {
    ArtsyWebView: ({ url }: { url: string }) => <Text testID="ArtsyWebView">{url}</Text>,
  }
})

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

  it("renders correctly", async () => {
    await renderWithRelay({
      Article: () => ({
        href: "/article/foo",
        title: "Example Article",
      }),
    })

    expect(screen.getByTestId("ArtsyWebView")).toHaveTextContent("/article/foo")
  })
})
