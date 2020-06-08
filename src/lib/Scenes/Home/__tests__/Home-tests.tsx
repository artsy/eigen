import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { NativeModules } from "react-native"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("lib/Components/Home/ArtistRails/ArtistRail", () => ({
  ArtistRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("lib/Scenes/Home/Components/ArtworkRail", () => ({
  ArtworkRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("lib/Scenes/Home/Components/FairsRail", () => ({
  FairsRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("lib/Scenes/Home/Components/SalesRail", () => ({
  SalesRailFragmentContainer: jest.fn(() => null),
}))

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

import { EmailConfirmationBanner } from "lib/Scenes/Home/Components/EmailConfirmationBanner"
import { SalesRailFragmentContainer } from "lib/Scenes/Home/Components/SalesRail"
import { FairsRailFragmentContainer } from "../Components/FairsRail"
import { HomeRenderer } from "../Home"

jest.unmock("react-relay")
const env = (defaultEnvironment as any) as ReturnType<typeof createMockEnvironment>

describe(HomeRenderer, () => {
  const originalAROptionsEnableSales = NativeModules.Emission.options.AROptionsEnableSales

  afterEach(() => {
    NativeModules.Emission.options.AROptionsEnableSales = originalAROptionsEnableSales
  })

  it("always renders sales and fairs", () => {
    const tree = ReactTestRenderer.create(<HomeRenderer />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("HomeQuery")

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          homePage: {
            artworkModules: [],
            artistModules: [],
            fairsModule: [],
            salesModule: [],
          },
          me: {
            canRequestEmailConfirmation: false,
          },
        },
      })
    })
    expect(tree.root.findAllByType(SalesRailFragmentContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(FairsRailFragmentContainer)).toHaveLength(1)
  })

  it("renders an email confirmation banner", () => {
    NativeModules.Emission.options.AROptionsEnableSales = true

    const tree = ReactTestRenderer.create(<HomeRenderer />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("HomeQuery")

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          homePage: {
            artworkModules: [],
            artistModules: [],
            fairsModule: [],
            salesModule: [],
          },
          me: {
            canRequestEmailConfirmation: true,
          },
        },
      })
    })

    expect(tree.root.findAllByType(EmailConfirmationBanner)).toHaveLength(1)
  })
})
