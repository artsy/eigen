import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Article from "../Article"

import { Theme } from "@artsy/palette"

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
  const articleComponent = renderer
    .create(
      <Theme>
        <Article article={article as any} />
      </Theme>
    )
    .toJSON()
  expect(articleComponent).toMatchSnapshot()
})
