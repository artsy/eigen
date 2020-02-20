import React from "react"
import "react-native"

import { renderWithLayout } from "../../../tests/renderWithLayout"
import { Notification } from "../Notification"

it("lays out correctly for unread notification", () => {
  const props = notification()
  const component = renderWithLayout(<Notification notification={props as any} />, { width: 768 })

  expect(component).toMatchSnapshot()
})

it("lays out correctly for read notification", () => {
  const props = notification()
  props.status = "READ"
  const component = renderWithLayout(<Notification notification={props as any} />, { width: 768 })

  expect(component).toMatchSnapshot()
})

it("does not show artist avatar if no avatar image exists", () => {
  const props = notification()
  props.image.resized.url = null
  const component = renderWithLayout(<Notification notification={props as any} />, { width: 300 })

  expect(component).toMatchSnapshot()
})

const notification = () => {
  return {
    artists: "Jean-Michel Basquiat",
    date: "Mar 16",
    summary: "1 Work Added",
    artworks: { edges: [{ title: "Anti-Product Postcard" }] },
    status: "UNREAD",
    image: {
      resized: {
        url: "cloudfront.url",
      },
    },
  }
}
