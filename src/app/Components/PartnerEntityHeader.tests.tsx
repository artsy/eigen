import { PartnerEntityHeaderTestsQuery } from "__generated__/PartnerEntityHeaderTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"

import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { PartnerEntityHeaderFragmentContainer } from "./PartnerEntityHeader"

describe("PartnerEntityHeader", () => {
  const TestRenderer = () => (
    <QueryRenderer<PartnerEntityHeaderTestsQuery>
      environment={getMockRelayEnvironment()}
      query={graphql`
        query PartnerEntityHeaderTestsQuery($id: String!) @relay_test_operation {
          partner(id: $id) {
            ...PartnerEntityHeader_partner
          }
        }
      `}
      variables={{ id: "example-partner" }}
      render={({ props, error }) => {
        if (props?.partner) {
          return <PartnerEntityHeaderFragmentContainer partner={props.partner} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(mockResolvers)
    return tree
  }

  it("renders correctly", () => {
    const wrapper = getWrapper({
      Partner: () => ({
        name: "Example Partner Name",
        cities: ["New York", "Berlin", "Tokyo", "Milan"],
      }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Example Partner Name")
    expect(text).toContain("New York, Berlin, +2 more")
    expect(text).toContain("Follow")
  })
})
