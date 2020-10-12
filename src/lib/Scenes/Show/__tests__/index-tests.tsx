import { indexTestsQuery } from "__generated__/indexTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import Show from "../"

jest.unmock("react-relay")

it("Renders a show", async () => {
  const env = createMockEnvironment() as ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<indexTestsQuery>
      environment={env}
      query={graphql`
        query indexTestsQuery @relay_test_operation {
          show(id: "art-gallery-pure-art-of-design-at-art-gallery-pure") {
            ...Show_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <Show show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const tree = renderWithWrappers(<TestRenderer />)
  env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation))
  expect(extractText(tree.root)).toContain("name")
})
