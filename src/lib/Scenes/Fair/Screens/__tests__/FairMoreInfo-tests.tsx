import { FairMoreInfoTestsQueryRawResponse } from "__generated__/FairMoreInfoTestsQuery.graphql"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { FairMoreInfo, shouldGoStraightToWebsite, shouldShowFairMoreInfo } from "../FairMoreInfo"

jest.unmock("react-relay")

import { navigate } from "lib/navigation/navigate"
import { renderRelayTree } from "lib/tests/renderRelayTree"

const renderTree = () =>
  renderRelayTree({
    Component: FairMoreInfo,
    query: graphql`
      query FairMoreInfoTestsQuery @raw_response_type {
        fair(id: "sofa-chicago-2018") {
          links
          about
          ticketsLink
        }
      }
    `,
    mockData: {
      fair: fairFixture,
    } as FairMoreInfoTestsQueryRawResponse,
  })

describe("FairMoreInfo", () => {
  it("renders without throwing an error", async () => {
    await renderTree()
  })
  it("renders fair about text", async () => {
    const tree = await renderTree()
    expect(tree.text()).toContain(fairFixture.about)
  })

  it("opens fair ticketsLink url", async () => {
    const tree = await renderTree()
    const button = tree.find("[text='Buy tickets']")

    button.props().onPress()

    expect(navigate).toHaveBeenCalledWith(fairFixture.ticketsLink, { modal: true })
  })
})

describe(shouldShowFairMoreInfo, () => {
  it("is false with an empty obj", () => {
    expect(shouldShowFairMoreInfo({})).toBeFalsy()
  })
  it("is true with a ticket link key", () => {
    expect(shouldShowFairMoreInfo({ ticketsLink: "http://" })).toBeTruthy()
  })
  it("is true with an about key", () => {
    expect(shouldShowFairMoreInfo({ about: "It's a long story..." })).toBeTruthy()
  })
})

describe(shouldGoStraightToWebsite, () => {
  it("is true with an org website", () => {
    expect(shouldGoStraightToWebsite({ organizer: { website: "http://" } })).toBeTruthy()
  })
  it("is false with a ticket link key", () => {
    expect(shouldGoStraightToWebsite({ ticketsLink: "http://", organizer: { website: "http://" } })).toBeFalsy()
  })
  it("is true with an about key", () => {
    expect(shouldGoStraightToWebsite({ about: "It's a long story...", organizer: { website: "http://" } })).toBeFalsy()
  })
})
