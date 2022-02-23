import "react-native"

import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"

import { ArtistShowFragmentContainer } from "./ArtistShow"

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

it("renders without throwing an error with all props", () => {
  renderWithWrappers(<ArtistShowFragmentContainer show={showProps as any} styles={showStyles} />)
})

it("renders without throwing an error with null show kind", () => {
  const showPropsNullKind = {
    ...showProps,
    kind: null,
  }

  renderWithWrappers(
    <ArtistShowFragmentContainer show={showPropsNullKind as any} styles={showStyles} />
  )
})
