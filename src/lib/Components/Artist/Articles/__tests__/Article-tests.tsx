import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import { ArticleContainer } from "../Article"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
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
  renderer.create(
    <Theme>
      <ArticleContainer article={article as any} />
    </Theme>
  )
})
