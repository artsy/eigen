import "react-native"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import Article from "../Article"

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
  renderWithWrappers(
    <Theme>
      <Article article={article as any} />
    </Theme>
  )
})
