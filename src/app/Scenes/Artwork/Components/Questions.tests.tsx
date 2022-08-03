import { Questions_Test_Query } from "__generated__/Questions_Test_Query.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Suspense } from "react"
import { Text } from "react-native"
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay"
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

  it("renders", async () => {
    const { queryByText } = renderWithWrappers(
      <RelayEnvironmentProvider environment={getRelayEnvironment()}>
        <Suspense fallback={<Text>SusLoading</Text>}>
          <TestRenderer />
        </Suspense>
      </RelayEnvironmentProvider>
    )
    resolveMostRecentRelayOperation({ Artwork: () => ({}) })
    expect(queryByText("SusLoading")).toBeDefined()

    expect(queryByText("Questions about this piece?")).toBeDefined()
    expect(queryByText("Contact Gallery")).toBeDefined()
  })
})
