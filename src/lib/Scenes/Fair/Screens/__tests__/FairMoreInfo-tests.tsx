import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { FairFixture } from "../../__fixtures__"
import { FairMoreInfoContainer as FairMoreInfo } from "../FairMoreInfo"

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
            ...FairMoreInfo_fair
          }
        }
      `}
      mockResolvers={{
        Fair: () => FairFixture,
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
    expect(tree.text()).toContain(FairFixture.about)
  })

  it("opens fair tickets_link url", async () => {
    const tree = await renderTree()
    const button = tree.find("[text='Buy tickets']")

    button.props().onPress()

    expect(SwitchBoard.presentModalViewController).toHaveBeenCalledWith(expect.anything(), FairFixture.tickets_link)
  })
})
