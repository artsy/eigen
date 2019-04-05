import { FairBoothShowFixture } from "lib/__fixtures__/FairBoothShowFixture"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { FairBoothHeaderContainer as FairBoothHeader } from "../../Components/FairBoothHeader"
import { FairBoothContainer as FairBooth } from "../FairBooth"

jest.unmock("react-relay")

xit("renders properly", async () => {
  const tree = await renderUntil(
    wrapper => wrapper.find(FairBoothHeader).length > 0,
    <MockRelayRenderer
      Component={({ show }) => <FairBooth show={show} />}
      query={graphql`
        query FairBoothTestsQuery {
          show(id: "two-palms-two-palms-at-art-basel-miami-beach-2018") {
            ...FairBooth_show
          }
        }
      `}
      mockResolvers={{
        Show: () => FairBoothShowFixture,
      }}
    />
  )
  expect(tree.html()).toMatchSnapshot()
})
