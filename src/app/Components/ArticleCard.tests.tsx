import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { TouchableWithoutFeedback } from "react-native"
import { ArticleCard } from "./ArticleCard"

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

  const tree = renderWithWrappersLEGACY(<ArticleCard article={article as any} onPress={onPress} />)
  tree.root.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
  expect(onPress).toHaveBeenCalled()
})
