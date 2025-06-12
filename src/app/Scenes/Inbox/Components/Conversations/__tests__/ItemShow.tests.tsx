import { fireEvent } from "@testing-library/react-native"
import { ItemShow_Test_Query } from "__generated__/ItemShow_Test_Query.graphql"
import { ItemShowFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/ItemShow"
import * as navigation from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ItemShowFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper<ItemShow_Test_Query>({
    Component: ({ show }) => <ItemShowFragmentContainer show={show!} />,
    query: graphql`
      query ItemShow_Test_Query {
        show(id: "test-show") {
          ...ItemShow_show
        }
      }
    `,
  })

  it("render", () => {
    const { getByText, getByTestId } = renderWithRelay({
      Show: () => ({
        name: "Test Show",
        href: "https://testhref",
        exhibitionPeriod: "Test Period",
        partner: {
          name: "Test Partner",
        },
        image: {
          thumbnailUrl: "https://testthumbnail",
        },
      }),
    })

    expect(getByText("Show")).toBeDefined()
    expect(getByText("Test Show")).toBeDefined()
    expect(getByText("Test Period")).toBeDefined()
    expect(getByText("Test Partner")).toBeDefined()
    expect(getByTestId("showImage")).toBeDefined()
  })

  it("navigates when clicked", () => {
    const navigateSpy = jest.spyOn(navigation, "navigate")
    const { getByTestId } = renderWithRelay({
      Show: () => ({
        href: "https://testhref",
      }),
    })

    fireEvent.press(getByTestId("showImage"))

    expect(navigateSpy).toHaveBeenCalledTimes(1)
    expect(navigateSpy).toHaveBeenCalledWith("https://testhref")
  })
})
