import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { FairMoreInfo } from "../FairMoreInfo"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentModalViewController: jest.fn(),
}))
jest.unmock("react-relay")

import SwitchBoard from "lib/NativeModules/SwitchBoard"

const renderTree = () =>
  renderUntil(
    wrapper => {
      return wrapper.text().includes("Buy tickets")
    },
    <MockRelayRenderer
      Component={FairMoreInfo}
      query={graphql`
        query FairMoreInfoTestsQuery {
          fair(id: "sofa-chicago-2018") {
            links
            about
            ticketsLink
          }
        }
      `}
      mockResolvers={{
        Fair: () => fairFixture,
      }}
    />
  )

describe("FairMoreInfo", () => {
  it("renders properly", async () => {
    const tree = await renderTree()
    expect(tree.html()).toMatchSnapshot()
  })
  it("renders fair about text", async () => {
    const tree = await renderTree()
    expect(tree.text()).toContain(fairFixture.about)
  })

  it("opens fair ticketsLink url", async () => {
    const tree = await renderTree()
    const button = tree.find("[text='Buy tickets']")

    button.props().onPress()

    expect(SwitchBoard.presentModalViewController).toHaveBeenCalledWith(expect.anything(), fairFixture.ticketsLink)
  })
})
