import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { FairFixture } from "../../__fixtures__"
import { FairExhibitorsContainer as FairExhibitors } from "../FairExhibitors"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.find("FairExhibitors").length > 0
    },
    <MockRelayRenderer
      Component={FairExhibitors}
      query={graphql`
        query FairExhibitorsTestsQuery {
          fair(id: "art-basel-in-miami-beach-2018") {
            ...FairExhibitors_fair
          }
        }
      `}
      mockResolvers={{
        Fair: () => FairFixture,
      }}
    />
  )
  expect(tree.html()).toMatchSnapshot()
})
