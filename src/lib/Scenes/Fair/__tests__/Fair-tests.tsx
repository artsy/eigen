import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import Fair from "../"
import { FairFixture } from "../__fixtures__"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.find("FairHeader").length > 0
    },
    <MockRelayRenderer
      Component={Fair}
      query={graphql`
        query FairTestsQuery {
          fair(id: "sofa-chicago-2018") {
            ...Fair_fair
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
