import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Articles from "../Articles"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const articles = [article(1), article(2)]
  const articlesComponent = renderer
    .create(
      <Theme>
        <Articles articles={articles} />
      </Theme>
    )
    .toJSON()
  expect(articlesComponent).toMatchSnapshot()
})

const article = n => {
  return {
    id: `artwork-john-berger-${n}`,
    thumbnail_title: "Something Happened",
    href: "artsy.net/something-happened",
    author: {
      name: "John Berger",
    },
    thumbnail_image: {
      url: "artsy.net/image-url",
    },
  } as any
}
