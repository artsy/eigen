import { waitFor } from "@testing-library/react-native"
import { Questions_Test_Query } from "__generated__/Questions_Test_Query.graphql"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
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
    const { getByText, getAllByText } = renderWithWrappersTL(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <Suspense fallback={<Text>SusLoading</Text>}>
          <TestRenderer />
        </Suspense>
      </RelayEnvironmentProvider>
    )
    mockEnvironmentPayload(mockEnvironment, { Artwork: () => ({}) })
    await waitFor(() => expect(getByText("SusLoading")).toBeDefined())

    await waitFor(() => expect(getByText("Questions about this piece?")).toBeDefined())
    expect(getAllByText("Contact Gallery")).toHaveLength(2)
  })
})
