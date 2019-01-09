import React from "react"
import { graphql } from "react-relay"

import { Theme } from "@artsy/palette"
import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"

import { FairBoothHeader } from "../Components/FairBoothHeader"
import { FairBoothContainer as FairBooth } from "../FairBooth"

jest.unmock("react-relay")

const render = () =>
  renderUntil(
    wrapper => {
      return wrapper.find(FairBoothHeader)
    },
    <MockRelayRenderer
      Component={({ show }) => (
        <Theme>
          <FairBooth show={show} onViewWorksPressed={jest.fn()} />
        </Theme>
      )}
      query={graphql`
        query FairBoothTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...FairBooth_show
          }
        }
      `}
      mockResolvers={{
        Show: () => ShowFixture,
      }}
    />
  )

describe("FairBooth", () => {
  it("renders", async () => {
    const tree = await render()
    expect(tree.html()).toMatchSnapshot()
  })
})
