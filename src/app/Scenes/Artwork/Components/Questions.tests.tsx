import { Questions_Test_Query } from "__generated__/Questions_Test_Query.graphql"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Suspense } from "react"
import { Text } from "react-native"
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { Questions } from "./Questions"

jest.unmock("react-relay")

describe("Questions", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<Questions_Test_Query>(
      graphql`
        query Questions_Test_Query @raw_response_type {
          artwork(id: "test-id") {
            ...Questions_artwork
          }
        }
      `,
      {}
    )
    return <Questions artwork={data.artwork!} />
  }

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("renders", async () => {
    const { queryByText } = renderWithWrappersTL(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <Suspense fallback={<Text>SusLoading</Text>}>
          <TestRenderer />
        </Suspense>
      </RelayEnvironmentProvider>
    )
    resolveMostRecentRelayOperation(mockEnvironment, { Artwork: () => ({}) })
    expect(queryByText("SusLoading")).toBeDefined()

    expect(queryByText("Questions about this piece?")).toBeDefined()
    expect(queryByText("Contact Gallery")).toBeDefined()
  })
})
