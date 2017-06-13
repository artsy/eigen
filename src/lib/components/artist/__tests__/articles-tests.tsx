import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import Articles from "../articles"

it("renders properly", () => {
  const articles = [article(1), article(2)]
  const articlesComponent = renderer.create(<Articles articles={articles} />).toJSON()
  expect(articlesComponent).toMatchSnapshot()
})

const article = n => {
  return {
    __id: `artwork-john-berger-${n}`,
    thumbnail_title: "Something Happened",
    href: "artsy.net/something-happened",
    author: {
      name: "John Berger",
    },
    thumbnail_image: {
      url: "artsy.net/image-url",
    },
  }
}
