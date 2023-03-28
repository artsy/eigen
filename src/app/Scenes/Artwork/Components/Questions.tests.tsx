import { Questions_Test_Query } from "__generated__/Questions_Test_Query.graphql"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Suspense } from "react"
import { Text } from "react-native"
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { Questions } from "./Questions"

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
    const { getByText } = renderWithWrappers(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <Suspense fallback={<Text>SusLoading</Text>}>
          <TestRenderer />
        </Suspense>
      </RelayEnvironmentProvider>
    )
    resolveMostRecentRelayOperation(mockEnvironment, { Artwork: () => ({}) })
    expect(getByText("SusLoading")).toBeDefined()

    await flushPromiseQueue()

    expect(getByText("Questions about this piece?")).toBeDefined()
    expect(getByText("Contact Gallery")).toBeDefined()
  })
})
