import { fireEvent, screen } from "@testing-library/react-native"
import { ArticleCard } from "app/Components/ArticleCard"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing an error", () => {
  const onPress = jest.fn()
  const article = {
    thumbnailTitle: "Something Happened",
    href: "artsy.net/something-happened",
    byline: "John Berger",
    thumbnailImage: {
      url: "artsy.net/image-url",
    },
  }

  renderWithWrappers(<ArticleCard article={article as any} onPress={onPress} />)

  fireEvent(screen.getByTestId("article-card"), "press")

  expect(onPress).toHaveBeenCalled()
})
