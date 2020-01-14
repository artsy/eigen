import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import ArtistShow from "../ArtistShow"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const showProps = {
    href: "artsy.net/show",
    cover_image: {
      url: "artsy.net/image-url",
    },
    kind: "solo",
    name: "Expansive Exhibition",
    exhibition_period: "Jan 1 - March 1",
    status_update: "Closing in 2 days",
    status: "running",
    partner: {
      name: "Gallery",
    },
    location: {
      city: "Berlin",
    },
  }

  const showStyles = {
    container: {
      margin: 10,
      marginBottom: 30,
      width: 100,
    },
    image: {
      width: 50,
      height: 50,
    },
  }

  const show = renderer
    .create(
      <Theme>
        <ArtistShow show={showProps as any} styles={showStyles} />
      </Theme>
    )
    .toJSON()
  expect(show).toMatchSnapshot()

  const showPropsNullKind = {
    href: "artsy.net/show",
    cover_image: {
      url: "artsy.net/image-url",
    },
    name: "Expansive Exhibition",
    exhibition_period: "Jan 1 - March 1",
    status_update: "Closing in 2 days",
    status: "running",
    partner: {
      name: "Gallery",
    },
    location: {
      city: "Berlin",
    },
  }

  const showNullKind = renderer
    .create(
      <Theme>
        <ArtistShow show={showPropsNullKind as any} styles={showStyles} />
      </Theme>
    )
    .toJSON()
  expect(showNullKind).toMatchSnapshot()
})
