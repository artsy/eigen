// import { shallow } from "enzyme"
import { renderRelayTree } from "lib/tests/renderRelayTree"
// import React from "react"
import { graphql } from "react-relay"
import Fair from "../"
import { FairFixture } from "../__fixtures__"

// it("Renders a fair", () => {
//   const wrapper = shallow(<Fair fair={FairFixture as any} />)
//   expect(wrapper).toContain(FairFixture.name)
// })

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: Fair,
    query: graphql`
      query FairTestsQuery {
        fair(id: "sofa-chicago-2018") {
          ...FairHeader_fair
        }
      }
    `,
    mockResolvers: {
      Fair: () => FairFixture,
    },
  })

  expect(tree).toMatchSnapshot()
})
