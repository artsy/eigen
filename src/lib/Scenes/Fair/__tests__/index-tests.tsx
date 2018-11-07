// import { renderRelayTree } from "lib/tests/renderRelayTree"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import Fair from "../"
import { FairFixture } from "../__fixtures__"
// import { FairHeaderContainer as FairHeader } from "../Components/FairHeader"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderUntil(
    wrapper => {
      // console.log(wrapper.debug())
      return wrapper.find("FairHeader").length > 0
    },
    <MockRelayRenderer
      Component={Fair}
      query={graphql`
        query indexTestsQuery {
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
