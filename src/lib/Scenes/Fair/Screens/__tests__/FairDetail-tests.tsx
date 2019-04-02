import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { FairDetailContainer as FairDetail } from "../FairDetail"

jest.unmock("react-relay")

describe("FairDetail", () => {
  it("renders properly", async () => {
    const tree = await renderUntil(
      wrapper => {
        return wrapper.find("FairHeader").length > 0
      },
      <MockRelayRenderer
        Component={FairDetail}
        query={graphql`
          query FairDetailTestsQuery {
            fair(id: "sofa-chicago-2018") {
              ...FairDetail_fair
            }
          }
        `}
        mockData={{
          fair: fairFixture,
        }}
      />
    )

    expect(tree.html()).toMatchSnapshot()
  })
})
