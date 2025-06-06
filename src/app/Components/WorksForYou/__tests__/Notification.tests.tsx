import { renderWithLayout } from "app/utils/tests/renderWithLayout"
import "react-native"
import { Notification } from "app/Components/WorksForYou/Notification"

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
  const convertedProps = {
    ...props,
    image: {
      resized: {
        url: null,
      },
    },
  }
  renderWithLayout(<Notification width={300} notification={convertedProps as any} />, {
    width: 300,
  })
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
