import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { Theme } from "@artsy/palette"
import { ShowEventSectionTestsQuery } from "__generated__/ShowEventSectionTestsQuery.graphql"
import { ShowEventSectionContainer as ShowEventSection } from "../ShowEventSection"

jest.unmock("react-relay")

describe("ShowEventSection", () => {
  it("renders without throwing an error", async () => {
    const env = createMockEnvironment()
    const TestRenderer = () => (
      <QueryRenderer<ShowEventSectionTestsQuery>
        environment={env}
        query={graphql`
          query ShowEventSectionTestsQuery @raw_response_type {
            show(id: "anderson-fine-art-gallery-flickinger-collection") {
              events {
                ...ShowEventSection_event
              }
            }
          }
        `}
        variables={{}}
        render={({ props, error }) => {
          if (props?.show) {
            return (
              <Theme>
                <ShowEventSection event={props.show.events![0]!} />
              </Theme>
            )
          } else if (error) {
            console.log(error)
          }
        }}
      />
    )
    ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          show: {
            events: [
              {
                event_type: "dinner",
                description: "description",
              },
            ],
          },
        },
      })
    })
  })
})
