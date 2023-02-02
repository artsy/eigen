import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { RequestConditionReportTestQuery } from "__generated__/RequestConditionReportTestQuery.graphql"
import { RequestConditionReport_artwork$data } from "__generated__/RequestConditionReport_artwork.graphql"
import { RequestConditionReport_me$data } from "__generated__/RequestConditionReport_me.graphql"
import { mockPostEventToProviders } from "app/utils/tests/globallyMockedStuff"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
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

jest.unmock("react-tracking")

describe("RequestConditionReport", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<RequestConditionReportTestQuery>
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

  describe("component", () => {
    it("renders correctly", () => {
      const { queryByText, getByLabelText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        Me: () => me,
        Artwork: () => artwork,
      })

      expect(queryByText("Request a Report")).toBeTruthy()
      expect(getByLabelText("Condition Report Requested Modal")).toHaveProp("visible", false)
      expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", false)
    })

    it("shows an error modal on failure", async () => {
      const { getByText, queryByText, getByLabelText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        Me: () => me,
        Artwork: () => artwork,
      })

      expect(queryByText("Request a Report")).toBeTruthy()
      fireEvent.press(getByText("Request a Report"))

      // successfully tracks the press of the button
      expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
      expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action_name": "requestConditionReport",
            "action_type": "tap",
            "context_module": "ArtworkDetails",
          },
        ]
      `)

      expect(env.mock.getMostRecentOperation().request.node.operation.name).toEqual(
        "RequestConditionReportMutation"
      )

      rejectMostRecentRelayOperation(env, new Error("Error saving artwork"))

      expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", false)

      await waitFor(() =>
        expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", true)
      )

      // tracks the fail event successfully
      expect(mockPostEventToProviders).toHaveBeenCalledTimes(2)
      expect(mockPostEventToProviders.mock.calls[1]).toMatchInlineSnapshot(`
        [
          {
            "action_name": "requestConditionReport",
            "action_type": "fail",
            "context_module": "ArtworkDetails",
          },
        ]
      `)

      expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", true)
      expect(getByLabelText("Condition Report Requested Modal")).toHaveProp("visible", false)
    })

    it("displays correct text when ARArtworkRedesingPhase2 ff is false", () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        Me: () => me,
        Artwork: () => artwork,
      })

      expect(screen.queryByText("Request a Report")).toBeTruthy()
    })

    it("shows a success modal on success", async () => {
      const { getByText, queryByText, getByLabelText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        Me: () => me,
        Artwork: () => artwork,
      })

      expect(queryByText("Request a Report")).toBeTruthy()
      fireEvent.press(getByText("Request a Report"))

      // successfully tracks the press of the button
      expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
      expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action_name": "requestConditionReport",
            "action_type": "tap",
            "context_module": "ArtworkDetails",
          },
        ]
      `)

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

      // tracks the success event successfully
      expect(mockPostEventToProviders).toHaveBeenCalledTimes(2)
      expect(mockPostEventToProviders.mock.calls[1]).toMatchInlineSnapshot(`
        [
          {
            "action_name": "requestConditionReport",
            "action_type": "success",
            "context_module": "ArtworkDetails",
          },
        ]
      `)

      expect(getByLabelText("Condition Report Requested Modal")).toHaveProp("visible", true)
      expect(getByLabelText("Condition Report Requested Error Modal")).toHaveProp("visible", false)
    })
  })
})
