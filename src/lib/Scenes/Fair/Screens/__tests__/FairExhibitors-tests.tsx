import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { FairFixture } from "../../__fixtures__"
import { FairExhibitors } from "../FairExhibitors"

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
            exhibitors_grouped_by_name {
              letter
              exhibitors {
                name
                id
                profile_id
              }
            }
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
