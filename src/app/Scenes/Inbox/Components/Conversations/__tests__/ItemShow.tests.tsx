import { fireEvent, screen } from "@testing-library/react-native"
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

  it("render", async () => {
    await renderWithRelay({
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

    expect(screen.getByText("Show")).toBeDefined()
    expect(screen.getByText("Test Show")).toBeDefined()
    expect(screen.getByText("Test Period")).toBeDefined()
    expect(screen.getByText("Test Partner")).toBeDefined()
    expect(screen.getByTestId("showImage")).toBeDefined()
  })

  it("navigates when clicked", async () => {
    const navigateSpy = jest.spyOn(navigation, "navigate")
    await renderWithRelay({
      Show: () => ({
        href: "https://testhref",
      }),
    })

    await fireEvent.press(screen.getByTestId("showImage"))

    expect(navigateSpy).toHaveBeenCalledTimes(1)
    expect(navigateSpy).toHaveBeenCalledWith("https://testhref")
  })
})
