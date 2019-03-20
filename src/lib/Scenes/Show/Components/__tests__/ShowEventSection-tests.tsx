import React from "react"
import { graphql } from "react-relay"

import { Theme } from "@artsy/palette"
import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import { ShowEventSectionContainer as ShowEventSection } from "../ShowEventSection"

jest.unmock("react-relay")

describe("ShowEventSection", () => {
  it("renders", async () => {
    const tree = await renderUntil(
      wrapper => wrapper.text().length > 0,
      <MockRelayRenderer
        Component={({ show }) => (
          <Theme>
            <ShowEventSection event={show.events[0]} />
          </Theme>
        )}
        query={graphql`
          query ShowEventSectionTestsQuery {
            show(id: "anderson-fine-art-gallery-flickinger-collection") {
              events {
                ...ShowEventSection_event
              }
            }
          }
        `}
        mockResolvers={{
          Show: () => ShowFixture,
        }}
      />
    )
    expect(tree.html()).toMatchSnapshot()
  })
})
