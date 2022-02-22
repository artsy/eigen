import { fireEvent } from "@testing-library/react-native"
import * as navigation from "app/navigation/navigate"
import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { ItemShowFragmentContainer } from "./ItemShow"

jest.unmock("react-relay")

describe("ItemShowFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: (props) => (
      <Theme>
        <ItemShowFragmentContainer {...props} />
      </Theme>
    ),
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
