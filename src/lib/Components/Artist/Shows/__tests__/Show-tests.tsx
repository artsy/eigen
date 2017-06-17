import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import Show from "../Show"

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

  const show = renderer.create(<Show show={showProps} styles={showStyles} />).toJSON()
  expect(show).toMatchSnapshot()
})
