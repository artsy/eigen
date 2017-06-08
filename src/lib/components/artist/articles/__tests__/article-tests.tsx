import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import Article from "../article"

it("renders properly", () => {
  const article = {
    thumbnail_title: "Something Happened",
    href: "artsy.net/something-happened",
    author: {
      name: "John Berger",
    },
    thumbnail_image: {
      url: "artsy.net/image-url",
    },
  }
  const articleComponent = renderer.create(<Article article={article} />).toJSON()
  expect(articleComponent).toMatchSnapshot()
})
