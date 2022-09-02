import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { Notification } from "./Notification"

it("renders without throwing an error for unread notification", () => {
  const props = notification()
  renderWithRelayWrappers(<Notification width={768} notification={props as any} />)
})

it("renders without throwing an error for read notification", () => {
  const props = notification()
  props.status = "READ"
  renderWithRelayWrappers(<Notification width={768} notification={props as any} />)
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
  renderWithRelayWrappers(<Notification width={300} notification={convertedProps as any} />)
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
