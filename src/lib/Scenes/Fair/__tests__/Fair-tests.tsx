import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { fairFixture } from "../__fixtures__"
import { Fair, FairContainer as FairScreen } from "../Fair"
import { FairMoreInfoRenderer as FairMoreInfoScreen } from "../Screens/FairMoreInfo"

jest.unmock("react-relay")

// FIXME: Fix fixture data
describe("Fair", () => {
  const renderTree = () =>
    renderRelayTree({
      Component: FairScreen,
      query: graphql`
        query FairTestsQuery @raw_response_type {
          fair(id: "sofa-chicago-2018") {
            ...Fair_fair
          }
        }
      `,
      mockData: {
        fair: fairFixture,
      },
    })

  xit("renders properly", async () => {
    expect((await renderTree()).html()).toMatchSnapshot()
  })

  xit("handles navigation to FairMoreInfo", async () => {
    const tree = await renderTree()

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
