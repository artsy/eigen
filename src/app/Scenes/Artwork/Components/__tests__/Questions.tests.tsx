import { screen } from "@testing-library/react-native"
import { Questions_Test_Query } from "__generated__/Questions_Test_Query.graphql"
import { Questions } from "app/Scenes/Artwork/Components/Questions"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Suspense } from "react"
import { Text } from "react-native"
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("Questions", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<Questions_Test_Query>(
      graphql`
        query Questions_Test_Query @raw_response_type {
          artwork(id: "test-id") {
            ...Questions_artwork
          }
          me {
            ...useSendInquiry_me
            ...MyProfileEditModal_me
          }
        }
      `,
      {}
    )
    return <Questions artwork={data.artwork!} me={data.me!} />
  }

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("renders", async () => {
    renderWithWrappers(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <Suspense fallback={<Text>SusLoading</Text>}>
          <TestRenderer />
        </Suspense>
      </RelayEnvironmentProvider>
    )
    resolveMostRecentRelayOperation(mockEnvironment, { Artwork: () => ({}) })
    expect(screen.getByText("SusLoading")).toBeDefined()

    await flushPromiseQueue()

    expect(screen.getByText("Questions about this piece?")).toBeDefined()
    expect(screen.getByText("Contact Gallery")).toBeDefined()
  })
})
