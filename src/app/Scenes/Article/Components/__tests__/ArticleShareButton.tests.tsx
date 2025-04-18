import { fireEvent, screen } from "@testing-library/react-native"
import { ArticleShareButton } from "app/Scenes/Article/Components/ArticleShareButton"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import RNShare from "react-native-share"
import { graphql } from "react-relay"

// Mock react-native-share module
jest.mock("react-native-share", () => ({
  open: jest.fn(),
}))

describe("ArticleShareButton", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArticleShareButton,
    query: graphql`
      query ArticleShareButtonTestQuery {
        article(id: "foo") {
          ...ArticleShareButton_article
        }
      }
    `,
  })

  it("shares the article", () => {
    renderWithRelay({
      Article: () => ({
        href: "/article/foo",
        title: "Example Article",
      }),
    })

    expect(screen.getByTestId("shareButton")).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId("shareButton"))

    expect(RNShare.open).toHaveBeenCalledWith({
      title: "Example Article",
      message:
        "Example Article on Artsy\nhttps://staging.artsy.net/article/foo?utm_content=article-share",
      failOnCancel: false,
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedArticleShare",
        context_module: "article",
        context_screen_owner_id: '<mock-value-for-field-"internalID">',
        context_screen_owner_slug: '<mock-value-for-field-"slug">',
        context_screen_owner_type: "article",
      })
    )
  })
})
