import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { ArticleCard } from "./ArticleCard"

it("renders without throwing an error", () => {
  const onPress = jest.fn()
  const article = {
    thumbnailTitle: "Something Happened",
    href: "artsy.net/something-happened",
    author: {
      name: "John Berger",
    },
    thumbnailImage: {
      url: "artsy.net/image-url",
    },
  }

  const tree = renderWithWrappers(<ArticleCard article={article as any} onPress={onPress} />)
  tree.root.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
  expect(onPress).toHaveBeenCalled()
})
