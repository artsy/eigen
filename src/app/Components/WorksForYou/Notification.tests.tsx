import React from "react"
import "react-native"

import { renderWithLayout } from "app/tests/renderWithLayout"
import { Notification } from "./Notification"

it("renders without throwing an error for unread notification", () => {
  const props = notification()
  renderWithLayout(<Notification width={768} notification={props as any} />, { width: 768 })
})

it("renders without throwing an error for read notification", () => {
  const props = notification()
  props.status = "READ"
  renderWithLayout(<Notification width={768} notification={props as any} />, { width: 768 })
})

it("renders without throwing an error if no avatar image exists", () => {
  const props = notification()
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  props.image.resized.url = null
  renderWithLayout(<Notification width={300} notification={props as any} />, { width: 300 })
})

const notification = () => {
  return {
    artists: "Jean-Michel Basquiat",
    date: "Mar 16",
    summary: "1 Work Added",
    artworks: { edges: [{ node: { title: "Anti-Product Postcard" } }] },
    status: "UNREAD",
    image: {
      resized: {
        url: "cloudfront.url",
      },
    },
  }
}
