import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import React from "react"
import "react-native"
import { RelayProp } from "react-relay"
import * as renderer from "react-test-renderer"
import { ShowHeader } from "../index"

import { Theme } from "@artsy/palette"

it("looks correct when rendered", () => {
  const comp = renderer.create(
    <Theme>
      <ShowHeader
        relay={
          {
            environment: {},
          } as RelayProp
        }
        show={ShowFixture as any}
      />
    </Theme>
  )
  expect(comp).toMatchSnapshot()
})
