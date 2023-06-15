import { ShareIcon } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArticleShareButton } from "app/Scenes/Article/Components/ArticleShareButton"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import RNShare from "react-native-share"
import { act } from "react-test-renderer"
import { graphql } from "relay-runtime"

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

    expect(screen.UNSAFE_getByType(ShareIcon)).toBeOnTheScreen()

    act(() => {
      fireEvent.press(screen.getByTestId("shareButton"))
    })

    expect(RNShare.open).toHaveBeenCalledWith({
      title: "Example Article",
      message:
        "Example Article on Artsy\nhttps://staging.artsy.net/article/foo?utm_content=article-share",
      failOnCancel: false,
    })
  })
})
