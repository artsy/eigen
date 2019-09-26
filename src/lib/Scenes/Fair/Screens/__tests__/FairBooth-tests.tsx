import { FairBoothShowFixture } from "lib/__fixtures__/FairBoothShowFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { FairBoothContainer as FairBooth } from "../FairBooth"

jest.unmock("react-relay")

// FIXME: This one is unstable. It passes most of the time but not always. Because we take snapshots of HTML it is hard
//        to understand exactly what changed. We should switch to snapshotting JSON and determine if the FairBooth
//        renders correctly atm.
xit("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: ({ show }) => <FairBooth show={show} />,
    query: graphql`
      query FairBoothTestsQuery {
        show(id: "two-palms-two-palms-at-art-basel-miami-beach-2018") {
          ...FairBooth_show
        }
      }
    `,
    mockResolvers: {
      Show: () => FairBoothShowFixture,
    },
  })
  expect(tree.html()).toMatchSnapshot()
})
