import { ShowEventSectionTestsQuery } from "__generated__/ShowEventSectionTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
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
            return <ShowEventSection event={props.show.events![0]!} />
          } else if (error) {
            console.log(error)
          }
        }}
      />
    )
    renderWithWrappers(<TestRenderer />)
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
