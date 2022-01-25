import { MyAccountTestsQuery } from "__generated__/MyAccountTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Sans } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyAccountContainer, MyAccountQueryRenderer } from "./MyAccount"

jest.unmock("react-relay")

describe(MyAccountQueryRenderer, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyAccountTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyAccountTestsQuery {
          me {
            ...MyAccount_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props?.me) {
          return <MyAccountContainer me={props.me} />
        } else if (error) {
          console.log(error)
        }
      }}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("truncated long emails", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Me: () => ({
          name: "pavlos",
          email:
            "myverylongemailmyverylongemailmyverylongemail@averylongdomainaverylongdomainaverylongdomain.com",
          phone: "123",
          paddleNumber: "321",
          hasPassword: true,
        }),
      })
      return result
    })

    expect(tree.findAllByType(Sans)[4].props.children).toBe(
      "myverylongemailmyverylongemailmyverylongemail@averylongdomainaverylongdomainaverylongdomain.com"
    )
  })
})
