import { PartnerEntityHeaderTestsQuery } from "__generated__/PartnerEntityHeaderTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { PartnerEntityHeaderFragmentContainer } from "./PartnerEntityHeader"

jest.unmock("react-relay")

describe("PartnerEntityHeader", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<PartnerEntityHeaderTestsQuery>
      environment={env}
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
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
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
