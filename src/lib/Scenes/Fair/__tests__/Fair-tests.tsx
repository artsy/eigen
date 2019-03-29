import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { fairFixture } from "../__fixtures__"
import { Fair, FairContainer as FairScreen } from "../Fair"
import { FairMoreInfoRenderer as FairMoreInfoScreen } from "../Screens/FairMoreInfo"

jest.unmock("react-relay")

describe("Fair", () => {
  let tree
  beforeAll(async () => {
    tree = await renderUntil(
      wrapper => {
        return wrapper.find("FairHeader").length > 0
      },
      <MockRelayRenderer
        Component={FairScreen}
        query={graphql`
          query FairTestsQuery {
            fair(id: "sofa-chicago-2018") {
              ...Fair_fair
            }
          }
        `}
        mockData={{
          fair: fairFixture,
        }}
      />
    )
  })

  xit("renders properly", () => {
    expect(tree.html()).toMatchSnapshot()
  })

  xit("handles navigation to FairMoreInfo", () => {
    const mockedPush = jest.fn()
    tree.find(Fair).instance().navigator = { push: mockedPush }

    const button = tree.find("Fair").find("[text='View more information']")
    button.props().onPress()

    expect(mockedPush).toHaveBeenCalledWith(
      expect.objectContaining({
        component: FairMoreInfoScreen,
      })
    )
  })
})
