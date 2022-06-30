import { act, fireEvent, waitFor } from "@testing-library/react-native"
import { RequestConditionReport_artwork$data } from "__generated__/RequestConditionReport_artwork.graphql"
import { RequestConditionReport_me$data } from "__generated__/RequestConditionReport_me.graphql"
import { RequestConditionReportQuery } from "__generated__/RequestConditionReportQuery.graphql"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { RequestConditionReportFragmentContainer } from "./RequestConditionReport"

const artwork: RequestConditionReport_artwork$data = {
  " $fragmentType": "RequestConditionReport_artwork",
  internalID: "some-internal-id",
  slug: "pablo-picasso-guernica",
  saleArtwork: {
    internalID: "some-sale-internal-id",
  },
}
const me: RequestConditionReport_me$data = {
  " $fragmentType": "RequestConditionReport_me",
  email: "someemail@testerino.net",
  internalID: "some-id",
}

jest.unmock("react-relay")

describe("RequestConditionReport", () => {
  const TestRenderer = () => {
    return (
      <QueryRenderer<RequestConditionReportQuery>
        environment={env}
        variables={{ artworkID: "some-internal-id" }}
        query={graphql`
          query RequestConditionReportTestQuery($artworkID: String!) {
            me {
              ...RequestConditionReport_me
            }
            artwork(id: $artworkID) {
              ...RequestConditionReport_artwork
            }
          }
        `}
        render={({ props }) => {
          if (props) {
            return (
              <RequestConditionReportFragmentContainer artwork={props.artwork!} me={props.me!} />
            )
          }
          return null
        }}
      />
    )
  }

  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("renders correctly", () => {
    const { queryByText, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      Me: () => me,
      Artwork: () => artwork,
    })

    expect(queryByText("Request condition report")).toBeTruthy()
    expect(getByLabelText("Condition Report Requested Modal")).toHaveProp("visible", false)
    expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", false)
  })

  it("shows an error modal on failure", async () => {
    const { getByText, queryByText, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      Me: () => me,
      Artwork: () => artwork,
    })

    expect(queryByText("Request condition report")).toBeTruthy()
    fireEvent.press(getByText("Request condition report"))

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toEqual(
      "RequestConditionReportMutation"
    )

    act(() => env.mock.rejectMostRecentOperation(new Error("Error saving artwork")))

    expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", false)

    await waitFor(() =>
      expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", true)
    )

    expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", true)
    expect(getByLabelText("Condition Report Requested Modal")).toHaveProp("visible", false)
  })

  it("shows a success modal on success", async () => {
    const { getByText, queryByText, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      Me: () => me,
      Artwork: () => artwork,
    })

    expect(queryByText("Request condition report")).toBeTruthy()
    fireEvent.press(getByText("Request condition report"))

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toEqual(
      "RequestConditionReportMutation"
    )

    act(() =>
      env.mock.resolveMostRecentOperation({ data: { requestConditionReport: { success: true } } })
    )

    expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", false)
    expect(getByLabelText("Condition Report Requested Modal")).toHaveProp("visible", false)

    await waitFor(() =>
      expect(getByLabelText("Condition Report Requested Modal")).toHaveProp("visible", true)
    )

    expect(getByLabelText("Condition Report Requested Modal")).toHaveProp("visible", true)
    expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", false)
  })
})
